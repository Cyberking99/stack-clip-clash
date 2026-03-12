;; title: clash-token
;; summary: SIP-010 compliant utility token for ClipClash.

;; traits
(impl-trait .sip-010-trait.sip-010-trait)

;; token definitions
(define-fungible-token clash-token)

;; constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; public functions
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? clash-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? clash-token amount recipient)
  )
)

;; read only functions
(define-read-only (get-name)
  (ok "ClipClash Token")
)

(define-read-only (get-symbol)
  (ok "CLASH")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance clash-token who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply clash-token))
)

(define-read-only (get-token-uri)
  (ok none)
)
