;; title: user-registry
;; summary: Map Stacks principals to BNS identities and track performer stats.

;; constants
(define-constant contract-owner tx-sender)
(define-constant err-not-found (err u404))
(define-constant err-unauthorized (err u401))

;; data maps
(define-map users
  principal
  {
    bns-name: (optional (string-ascii 48)),
    wins: uint,
    losses: uint,
    clout: uint
  }
)

;; public functions

;; @desc Register or update user BNS identity
;; @param bns-name: The human-readable BNS name (e.g. "performer.btc")
(define-public (register-user (bns-name (optional (string-ascii 48))))
  (let
    (
      (current-user (get-user tx-sender))
    )
    (ok (map-set users tx-sender
      (merge current-user { bns-name: bns-name })
    ))
  )
)

;; @desc Admin function to update user stats (will be called by battle-manager in Phase 2)
(define-public (update-user-stats (user principal) (win bool) (clout-change uint))
  (let
    (
      (current-data (get-user user))
    )
    ;; In a real scenario, we'd check if the caller is the battle-manager contract
    (asserts! (is-eq tx-sender contract-owner) err-unauthorized)
    (ok (map-set users user
      (merge current-data {
        wins: (if win (+ (get wins current-data) u1) (get wins current-data)),
        losses: (if win (get losses current-data) (+ (get losses current-data) u1)),
        clout: (+ (get clout current-data) clout-change)
      })
    ))
  )
)

;; read-only functions

(define-read-only (get-user (user principal))
  (default-to
    {
      bns-name: none,
      wins: u0,
      losses: u0,
      clout: u0
    }
    (map-get? users user)
  )
)

(define-read-only (get-clout (user principal))
  (get clout (get-user user))
)
