import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

const CLASH_TOKEN = "clash-token";
const BATTLE_MANAGER = "battle-manager";
const USER_REGISTRY = "user-registry";

describe("battle-manager integration tests", () => {
  it("executes a full battle lifecycle from creation to resolution and payout", () => {
    const stake = 1000000n;
    const cid1 = "QmVideo1";
    const cid2 = "QmVideo2";

    // 1. Initial Setup: Mint tokens to performers
    simnet.callPublicFn(CLASH_TOKEN, "mint", [Cl.uint(stake), Cl.principal(wallet1)], deployer);
    simnet.callPublicFn(CLASH_TOKEN, "mint", [Cl.uint(stake), Cl.principal(wallet2)], deployer);

    // 2. Create Battle (Wallet 1)
    simnet.callPublicFn(
      BATTLE_MANAGER,
      "create-battle",
      [Cl.stringAscii(cid1), Cl.uint(stake), Cl.principal(`${deployer}.${CLASH_TOKEN}`)],
      wallet1
    );

    // 3. Join Battle (Wallet 2)
    simnet.callPublicFn(
      BATTLE_MANAGER,
      "join-battle",
      [Cl.uint(0), Cl.stringAscii(cid2), Cl.principal(`${deployer}.${CLASH_TOKEN}`)],
      wallet2
    );

    // Verify status is "active"
    const activeBattle = simnet.callReadOnlyFn(BATTLE_MANAGER, "get-battle", [Cl.uint(0)], deployer);
    expect(activeBattle.result).toBeSome(Cl.tuple({
      performer1: Cl.principal(wallet1),
      performer2: Cl.some(Cl.principal(wallet2)),
      video1: Cl.stringAscii(cid1),
      video2: Cl.some(Cl.stringAscii(cid2)),
      stake: Cl.uint(stake),
      votes1: Cl.uint(0),
      votes2: Cl.uint(0),
      status: Cl.stringAscii("active"),
      winner: Cl.none()
    }));

    // 4. Voting Phase
    // Wallet 1 and Wallet 3 vote for Wallet 1 (v1 = 2)
    simnet.callPublicFn(BATTLE_MANAGER, "vote", [Cl.uint(0), Cl.uint(1)], wallet1);
    simnet.callPublicFn(BATTLE_MANAGER, "vote", [Cl.uint(0), Cl.uint(1)], wallet3);
    // Wallet 2 votes for Wallet 2 (v2 = 1)
    simnet.callPublicFn(BATTLE_MANAGER, "vote", [Cl.uint(0), Cl.uint(2)], wallet2);

    // 5. Resolution Phase (Deployer/Owner)
    const { result: resolveResult } = simnet.callPublicFn(
      BATTLE_MANAGER,
      "resolve-battle",
      [Cl.uint(0), Cl.principal(`${deployer}.${CLASH_TOKEN}`)],
      deployer
    );
    expect(resolveResult).toBeOk(Cl.bool(true));

    // 6. Verification: Battle Status & Winner
    const resolvedBattle = simnet.callReadOnlyFn(BATTLE_MANAGER, "get-battle", [Cl.uint(0)], deployer);
    expect(resolvedBattle.result).toBeSome(Cl.tuple({
      performer1: Cl.principal(wallet1),
      performer2: Cl.some(Cl.principal(wallet2)),
      video1: Cl.stringAscii(cid1),
      video2: Cl.some(Cl.stringAscii(cid2)),
      stake: Cl.uint(stake),
      votes1: Cl.uint(2),
      votes2: Cl.uint(1),
      status: Cl.stringAscii("resolved"),
      winner: Cl.some(Cl.principal(wallet1))
    }));

    // 7. Verification: Payout (Wallet 1 should have 2 * stake)
    const winnerBalance = simnet.callReadOnlyFn(CLASH_TOKEN, "get-balance", [Cl.principal(wallet1)], deployer);
    expect(winnerBalance.result).toBeOk(Cl.uint(stake * 2n));

    // 8. Verification: User Registry Stats (Wallet 1: 1 win, 10 clout; Wallet 2: 1 loss, 2 clout)
    const stats1 = simnet.callReadOnlyFn(USER_REGISTRY, "get-user", [Cl.principal(wallet1)], deployer);
    expect(stats1.result).toBeTuple({
      "bns-name": Cl.none(),
      wins: Cl.uint(1),
      losses: Cl.uint(0),
      clout: Cl.uint(10)
    });

    const stats2 = simnet.callReadOnlyFn(USER_REGISTRY, "get-user", [Cl.principal(wallet2)], deployer);
    expect(stats2.result).toBeTuple({
      "bns-name": Cl.none(),
      wins: Cl.uint(0),
      losses: Cl.uint(1),
      clout: Cl.uint(2)
    });
  });

  it("prevents double voting in the same battle", () => {
    const stake = 1000000n;
    simnet.callPublicFn(CLASH_TOKEN, "mint", [Cl.uint(stake), Cl.principal(wallet1)], deployer);
    simnet.callPublicFn(CLASH_TOKEN, "mint", [Cl.uint(stake), Cl.principal(wallet2)], deployer);
    simnet.callPublicFn(BATTLE_MANAGER, "create-battle", [Cl.stringAscii("vid1"), Cl.uint(stake), Cl.principal(`${deployer}.${CLASH_TOKEN}`)], wallet1);
    simnet.callPublicFn(BATTLE_MANAGER, "join-battle", [Cl.uint(0), Cl.stringAscii("vid2"), Cl.principal(`${deployer}.${CLASH_TOKEN}`)], wallet2);

    // First vote
    simnet.callPublicFn(BATTLE_MANAGER, "vote", [Cl.uint(0), Cl.uint(1)], wallet3);
    // Second vote from same wallet
    const { result } = simnet.callPublicFn(BATTLE_MANAGER, "vote", [Cl.uint(0), Cl.uint(1)], wallet3);
    expect(result).toBeErr(Cl.uint(401)); // err-unauthorized
  });

  it("fails resolution by non-owner", () => {
    const stake = 1000000n;
    simnet.callPublicFn(CLASH_TOKEN, "mint", [Cl.uint(stake), Cl.principal(wallet1)], deployer);
    simnet.callPublicFn(CLASH_TOKEN, "mint", [Cl.uint(stake), Cl.principal(wallet2)], deployer);
    simnet.callPublicFn(BATTLE_MANAGER, "create-battle", [Cl.stringAscii("vid1"), Cl.uint(stake), Cl.principal(`${deployer}.${CLASH_TOKEN}`)], wallet1);
    simnet.callPublicFn(BATTLE_MANAGER, "join-battle", [Cl.uint(0), Cl.stringAscii("vid2"), Cl.principal(`${deployer}.${CLASH_TOKEN}`)], wallet2);

    const { result } = simnet.callPublicFn(
      BATTLE_MANAGER,
      "resolve-battle",
      [Cl.uint(0), Cl.principal(`${deployer}.${CLASH_TOKEN}`)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(401)); // err-unauthorized
  });
});
