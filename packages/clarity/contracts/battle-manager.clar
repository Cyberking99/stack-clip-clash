;; title: battle-manager
;; summary: Orchestrate performance battles, manage stakes, and distribute rewards.

;; traits
(use-trait ft-trait .sip-010-trait.sip-010-trait)

;; constants
(define-constant contract-owner tx-sender)
(define-constant err-not-found (err u404))
(define-constant err-unauthorized (err u401))
(define-constant err-invalid-status (err u402))
(define-constant err-invalid-stake (err u403))

;; data vars
(define-data-var battle-nonce uint u0)

;; data maps
(define-map battles
  uint
  {
    performer1: principal,
    performer2: (optional principal),
    video1: (string-ascii 64),
    video2: (optional (string-ascii 64)),
    stake: uint,
    votes1: uint,
    votes2: uint,
    status: (string-ascii 16), ;; "pending", "active", "resolved"
    winner: (optional principal)
  }
)

(define-map voters
  { battle-id: uint, voter: principal }
  bool
)

;; public functions

;; @desc Create a new battle as performer 1
;; @param video-cid: IPFS CID of the performance clip
;; @param stake: Amount of $CLASH to stake
;; @param token: The $CLASH token contract (must implement sip-010)
(define-public (create-battle (video-cid (string-ascii 64)) (stake uint) (token <ft-trait>))
  (let
    (
      (id (var-get battle-nonce))
    )
    ;; Transfer stake from performer to contract
    (try! (contract-call? token transfer stake tx-sender (as-contract tx-sender) none))
    
    (map-set battles id {
      performer1: tx-sender,
      performer2: none,
      video1: video-cid,
      video2: none,
      stake: stake,
      votes1: u0,
      votes2: u0,
      status: "pending",
      winner: none
    })
    
    (var-set battle-nonce (+ id u1))
    (ok id)
  )
)

;; @desc Join an existing battle as performer 2
;; @param id: Battle ID to join
;; @param video-cid: IPFS CID of the performance clip
;; @param token: The $CLASH token contract
(define-public (join-battle (id uint) (video-cid (string-ascii 64)) (token <ft-trait>))
  (let
    (
      (battle (unwrap! (map-get? battles id) err-not-found))
    )
    ;; Validate status
    (asserts! (is-eq (get status battle) "pending") err-invalid-status)
    ;; Ensure performer 2 is not performer 1
    (asserts! (not (is-eq tx-sender (get performer1 battle))) err-unauthorized)
    
    ;; Transfer matching stake from performer 2 to contract
    (try! (contract-call? token transfer (get stake battle) tx-sender (as-contract tx-sender) none))
    
    (ok (map-set battles id (merge battle {
      performer2: (some tx-sender),
      video2: (some video-cid),
      status: "active"
    })))
  )
)

;; @desc Vote for a performer in a battle
;; @param id: Battle ID
;; @param vote-for: 1 for performer1, 2 for performer2
(define-public (vote (id uint) (vote-for uint))
  (let
    (
      (battle (unwrap! (map-get? battles id) err-not-found))
    )
    ;; Check if battle is active
    (asserts! (is-eq (get status battle) "active") err-invalid-status)
    ;; Check if already voted
    (asserts! (is-none (map-get? voters { battle-id: id, voter: tx-sender })) err-unauthorized)
    
    (map-set voters { battle-id: id, voter: tx-sender } true)
    
    (ok (map-set battles id (merge battle {
      votes1: (if (is-eq vote-for u1) (+ (get votes1 battle) u1) (get votes1 battle)),
      votes2: (if (is-eq vote-for u2) (+ (get votes2 battle) u1) (get votes2 battle))
    })))
  )
)

;; @desc Resolve a battle and distribute payouts
;; @param id: Battle ID
;; @param token: The $CLASH token contract
(define-public (resolve-battle (id uint) (token <ft-trait>))
  (let
    (
      (battle (unwrap! (map-get? battles id) err-not-found))
      (p1 (get performer1 battle))
      (p2 (unwrap! (get performer2 battle) err-not-found))
      (v1 (get votes1 battle))
      (v2 (get votes2 battle))
      (total-stake (* (get stake battle) u2))
    )
    ;; Only owner can resolve for MVP
    (asserts! (is-eq tx-sender contract-owner) err-unauthorized)
    ;; Only active battles can be resolved
    (asserts! (is-eq (get status battle) "active") err-invalid-status)
    
    (let
      (
        (winner (if (>= v1 v2) p1 p2))
        (loser (if (>= v1 v2) p2 p1))
      )
      ;; Transfer total stake to winner
      (try! (as-contract (contract-call? token transfer total-stake tx-sender winner none)))
      
      ;; Update user statistics in registry (requires same deployer/owner for current setup)
      ;; In Phase 2, this would use a more robust authorization
      (try! (contract-call? .user-registry update-user-stats winner true u10)) ;; +10 clout for winning
      (try! (contract-call? .user-registry update-user-stats loser false u2)) ;; +2 clout for participating
      
      (ok (map-set battles id (merge battle {
        status: "resolved",
        winner: (some winner)
      })))
    )
  )
)

;; read-only functions

(define-read-only (get-battle (id uint))
  (map-get? battles id)
)

(define-read-only (get-battle-status (id uint))
  (match (map-get? battles id)
    battle (ok (get status battle))
    err-not-found
  )
)
