import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const CLASH_TOKEN = "clash-token";
const BATTLE_MANAGER = "battle-manager";

describe("battle-manager tests", () => {
  it("allows a performer to create a battle", () => {
    const stake = 1000000n;
    const videoCid = "QmTest1234567890Video1";

    // 1. Mint tokens to wallet1
    simnet.callPublicFn(
      CLASH_TOKEN,
      "mint",
      [Cl.uint(stake), Cl.principal(wallet1)],
      deployer
    );

    // 2. Create battle
    const { result } = simnet.callPublicFn(
      BATTLE_MANAGER,
      "create-battle",
      [
        Cl.stringAscii(videoCid),
        Cl.uint(stake),
        Cl.principal(`${deployer}.${CLASH_TOKEN}`)
      ],
      wallet1
    );

    expect(result).toBeOk(Cl.uint(0)); // First battle ID should be 0

    // 3. Verify battle data
    const battleResult = simnet.callReadOnlyFn(
      BATTLE_MANAGER,
      "get-battle",
      [Cl.uint(0)],
      deployer
    );

    expect(battleResult.result).toBeSome(
      Cl.tuple({
        performer1: Cl.principal(wallet1),
        performer2: Cl.none(),
        video1: Cl.stringAscii(videoCid),
        video2: Cl.none(),
        stake: Cl.uint(stake),
        status: Cl.stringAscii("pending"),
        winner: Cl.none()
      })
    );

    // 4. Verify stake was transferred to contract
    const contractBalance = simnet.callReadOnlyFn(
      CLASH_TOKEN,
      "get-balance",
      [Cl.principal(`${deployer}.${BATTLE_MANAGER}`)],
      deployer
    );
    expect(contractBalance.result).toBeOk(Cl.uint(stake));
  });

  it("allows a second performer to join a battle", () => {
    const stake = 1000000n;
    const videoCid1 = "QmVideo1";
    const videoCid2 = "QmVideo2";

    // 1. Set up battle
    simnet.callPublicFn(CLASH_TOKEN, "mint", [Cl.uint(stake), Cl.principal(wallet1)], deployer);
    simnet.callPublicFn(CLASH_TOKEN, "mint", [Cl.uint(stake), Cl.principal(wallet2)], deployer);

    simnet.callPublicFn(
      BATTLE_MANAGER,
      "create-battle",
      [Cl.stringAscii(videoCid1), Cl.uint(stake), Cl.principal(`${deployer}.${CLASH_TOKEN}`)],
      wallet1
    );

    // 2. Join battle
    const { result } = simnet.callPublicFn(
      BATTLE_MANAGER,
      "join-battle",
      [
        Cl.uint(0),
        Cl.stringAscii(videoCid2),
        Cl.principal(`${deployer}.${CLASH_TOKEN}`)
      ],
      wallet2
    );

    expect(result).toBeOk(Cl.bool(true));

    // 3. Verify updated battle data
    const battleResult = simnet.callReadOnlyFn(
      BATTLE_MANAGER,
      "get-battle",
      [Cl.uint(0)],
      deployer
    );

    expect(battleResult.result).toBeSome(
      Cl.tuple({
        performer1: Cl.principal(wallet1),
        performer2: Cl.some(Cl.principal(wallet2)),
        video1: Cl.stringAscii(videoCid1),
        video2: Cl.some(Cl.stringAscii(videoCid2)),
        stake: Cl.uint(stake),
        status: Cl.stringAscii("active"),
        winner: Cl.none()
      })
    );

    // 4. Verify total stake in contract
    const contractBalance = simnet.callReadOnlyFn(
      CLASH_TOKEN,
      "get-balance",
      [Cl.principal(`${deployer}.${BATTLE_MANAGER}`)],
      deployer
    );
    expect(contractBalance.result).toBeOk(Cl.uint(stake * 2n));
  });

  it("prevents the same performer from joining their own battle", () => {
    const stake = 1000000n;
    simnet.callPublicFn(CLASH_TOKEN, "mint", [Cl.uint(stake * 2n), Cl.principal(wallet1)], deployer);
    simnet.callPublicFn(
      BATTLE_MANAGER,
      "create-battle",
      [Cl.stringAscii("vid"), Cl.uint(stake), Cl.principal(`${deployer}.${CLASH_TOKEN}`)],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      BATTLE_MANAGER,
      "join-battle",
      [Cl.uint(0), Cl.stringAscii("vid2"), Cl.principal(`${deployer}.${CLASH_TOKEN}`)],
      wallet1
    );

    expect(result).toBeErr(Cl.uint(401)); // err-unauthorized
  });
});
