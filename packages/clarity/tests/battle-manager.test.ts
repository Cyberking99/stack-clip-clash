import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

const TOKEN = "clash-token";
const MANAGER = "battle-manager";
const tokenPrincipal = () => Cl.principal(`${deployer}.${TOKEN}`);

function mintAndApprove(recipient: string, amount: bigint) {
  simnet.callPublicFn(TOKEN, "mint", [Cl.uint(amount), Cl.principal(recipient)], deployer);
}

describe("battle-manager: create-battle", () => {
  it("creates a battle on Stacks and returns battle id 0", () => {
    const stake = 1000000n;
    mintAndApprove(wallet1, stake);

    const { result } = simnet.callPublicFn(
      MANAGER,
      "create-battle",
      [Cl.stringAscii("QmClip1"), Cl.uint(stake), tokenPrincipal()],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(0));
  });

  it("stores battle with pending status on the Stacks chain", () => {
    const stake = 1000000n;
    mintAndApprove(wallet1, stake);

    simnet.callPublicFn(MANAGER, "create-battle", [Cl.stringAscii("QmClip1"), Cl.uint(stake), tokenPrincipal()], wallet1);

    const battle = simnet.callReadOnlyFn(MANAGER, "get-battle", [Cl.uint(0)], deployer);
    expect(battle.result).toBeSome(
      Cl.tuple({
        performer1: Cl.principal(wallet1),
        performer2: Cl.none(),
        video1: Cl.stringAscii("QmClip1"),
        video2: Cl.none(),
        stake: Cl.uint(stake),
        votes1: Cl.uint(0),
        votes2: Cl.uint(0),
        status: Cl.stringAscii("pending"),
        winner: Cl.none(),
      })
    );
  });

  it("increments battle nonce for each new Stacks battle", () => {
    const stake = 500000n;
    mintAndApprove(wallet1, stake * 2n);

    const r1 = simnet.callPublicFn(MANAGER, "create-battle", [Cl.stringAscii("QmA"), Cl.uint(stake), tokenPrincipal()], wallet1);
    const r2 = simnet.callPublicFn(MANAGER, "create-battle", [Cl.stringAscii("QmB"), Cl.uint(stake), tokenPrincipal()], wallet1);

    expect(r1.result).toBeOk(Cl.uint(0));
    expect(r2.result).toBeOk(Cl.uint(1));
  });

  it("transfers stake from performer to the Stacks contract", () => {
    const stake = 1000000n;
    mintAndApprove(wallet1, stake);

    simnet.callPublicFn(MANAGER, "create-battle", [Cl.stringAscii("QmClip"), Cl.uint(stake), tokenPrincipal()], wallet1);

    const bal = simnet.callReadOnlyFn(TOKEN, "get-balance", [Cl.principal(wallet1)], deployer);
    expect(bal.result).toBeOk(Cl.uint(0));
  });
});

describe("battle-manager: join-battle", () => {
  it("joins a pending Stacks battle and sets status to active", () => {
    const stake = 1000000n;
    mintAndApprove(wallet1, stake);
    mintAndApprove(wallet2, stake);

    simnet.callPublicFn(MANAGER, "create-battle", [Cl.stringAscii("QmP1"), Cl.uint(stake), tokenPrincipal()], wallet1);

    const { result } = simnet.callPublicFn(
      MANAGER,
      "join-battle",
      [Cl.uint(0), Cl.stringAscii("QmP2"), tokenPrincipal()],
      wallet2
    );
    expect(result).toBeOk(Cl.bool(true));

    const status = simnet.callReadOnlyFn(MANAGER, "get-battle-status", [Cl.uint(0)], deployer);
    expect(status.result).toBeOk(Cl.stringAscii("active"));
  });

  it("fails to join a non-existent Stacks battle", () => {
    const { result } = simnet.callPublicFn(
      MANAGER,
      "join-battle",
      [Cl.uint(999), Cl.stringAscii("QmX"), tokenPrincipal()],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(404)); // err-not-found
  });

  it("fails when performer1 tries to join their own Stacks battle", () => {
    const stake = 1000000n;
    mintAndApprove(wallet1, stake * 2n);

    simnet.callPublicFn(MANAGER, "create-battle", [Cl.stringAscii("QmSelf"), Cl.uint(stake), tokenPrincipal()], wallet1);

    const { result } = simnet.callPublicFn(
      MANAGER,
      "join-battle",
      [Cl.uint(0), Cl.stringAscii("QmSelf2"), tokenPrincipal()],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(401)); // err-unauthorized
  });

  it("fails to join an already active Stacks battle", () => {
    const stake = 1000000n;
    mintAndApprove(wallet1, stake);
    mintAndApprove(wallet2, stake);
    mintAndApprove(wallet3, stake);

    simnet.callPublicFn(MANAGER, "create-battle", [Cl.stringAscii("QmA"), Cl.uint(stake), tokenPrincipal()], wallet1);
    simnet.callPublicFn(MANAGER, "join-battle", [Cl.uint(0), Cl.stringAscii("QmB"), tokenPrincipal()], wallet2);

    const { result } = simnet.callPublicFn(
      MANAGER,
      "join-battle",
      [Cl.uint(0), Cl.stringAscii("QmC"), tokenPrincipal()],
      wallet3
    );
    expect(result).toBeErr(Cl.uint(402)); // err-invalid-status
  });
});

describe("battle-manager: vote", () => {
  function setupActiveBattle(stake = 1000000n) {
    mintAndApprove(wallet1, stake);
    mintAndApprove(wallet2, stake);
    simnet.callPublicFn(MANAGER, "create-battle", [Cl.stringAscii("QmV1"), Cl.uint(stake), tokenPrincipal()], wallet1);
    simnet.callPublicFn(MANAGER, "join-battle", [Cl.uint(0), Cl.stringAscii("QmV2"), tokenPrincipal()], wallet2);
  }

  it("casts a vote for performer1 in a Stacks battle", () => {
    setupActiveBattle();

    const { result } = simnet.callPublicFn(MANAGER, "vote", [Cl.uint(0), Cl.uint(1)], wallet3);
    expect(result).toBeOk(Cl.bool(true));

    const battle = simnet.callReadOnlyFn(MANAGER, "get-battle", [Cl.uint(0)], deployer);
    expect(battle.result).toBeSome(
      Cl.tuple({
        performer1: Cl.principal(wallet1),
        performer2: Cl.some(Cl.principal(wallet2)),
        video1: Cl.stringAscii("QmV1"),
        video2: Cl.some(Cl.stringAscii("QmV2")),
        stake: Cl.uint(1000000n),
        votes1: Cl.uint(1),
        votes2: Cl.uint(0),
        status: Cl.stringAscii("active"),
        winner: Cl.none(),
      })
    );
  });

  it("casts a vote for performer2 in a Stacks battle", () => {
    setupActiveBattle();

    simnet.callPublicFn(MANAGER, "vote", [Cl.uint(0), Cl.uint(2)], wallet3);

    const battle = simnet.callReadOnlyFn(MANAGER, "get-battle", [Cl.uint(0)], deployer);
    const votes2 = (battle.result as any).value.data.votes2.value;
    expect(votes2).toBe(1n);
  });

  it("prevents double voting in the same Stacks battle", () => {
    setupActiveBattle();

    simnet.callPublicFn(MANAGER, "vote", [Cl.uint(0), Cl.uint(1)], wallet3);
    const { result } = simnet.callPublicFn(MANAGER, "vote", [Cl.uint(0), Cl.uint(1)], wallet3);

    expect(result).toBeErr(Cl.uint(401)); // err-unauthorized
  });

  it("fails to vote on a non-existent Stacks battle", () => {
    const { result } = simnet.callPublicFn(MANAGER, "vote", [Cl.uint(999), Cl.uint(1)], wallet3);
    expect(result).toBeErr(Cl.uint(404)); // err-not-found
  });
});
