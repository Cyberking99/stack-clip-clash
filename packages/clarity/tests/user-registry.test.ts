import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("user-registry tests", () => {
  it("allows a user to register a BNS name", () => {
    const bnsName = "performer.btc";
    
    const { result } = simnet.callPublicFn(
      "user-registry",
      "register-user",
      [Cl.some(Cl.stringAscii(bnsName))],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));

    const userResult = simnet.callReadOnlyFn(
      "user-registry",
      "get-user",
      [Cl.principal(wallet1)],
      wallet1
    );
    
    expect(userResult.result).toBeTuple({
      "bns-name": Cl.some(Cl.stringAscii(bnsName)),
      wins: Cl.uint(0),
      losses: Cl.uint(0),
      clout: Cl.uint(0)
    });
  });

  it("returns default data for non-registered users", () => {
    const userResult = simnet.callReadOnlyFn(
      "user-registry",
      "get-user",
      [Cl.principal(wallet2)],
      wallet2
    );
    
    expect(userResult.result).toBeTuple({
      "bns-name": Cl.none(),
      wins: Cl.uint(0),
      losses: Cl.uint(0),
      clout: Cl.uint(0)
    });
  });

  it("allows the owner to update user stats", () => {
    const cloutChange = 10n;
    
    const { result } = simnet.callPublicFn(
      "user-registry",
      "update-user-stats",
      [Cl.principal(wallet1), Cl.bool(true), Cl.uint(cloutChange)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));

    const userResult = simnet.callReadOnlyFn(
      "user-registry",
      "get-user",
      [Cl.principal(wallet1)],
      deployer
    );
    
    expect(userResult.result).toBeTuple({
      "bns-name": Cl.none(), // Assuming we haven't registered in this block/simnet state if they are isolated
      wins: Cl.uint(1),
      losses: Cl.uint(0),
      clout: Cl.uint(cloutChange)
    });
  });

  it("fails to update stats if not owner", () => {
    const { result } = simnet.callPublicFn(
      "user-registry",
      "update-user-stats",
      [Cl.principal(wallet1), Cl.bool(true), Cl.uint(10n)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(401)); // err-unauthorized
  });
});
