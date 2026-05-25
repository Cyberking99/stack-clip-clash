import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("user-registry: register-user", () => {
  it("registers a user with a BNS name on the Stacks network", () => {
    const { result } = simnet.callPublicFn(
      "user-registry",
      "register-user",
      [Cl.some(Cl.stringAscii("performer.btc"))],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("registers a user without a BNS name", () => {
    const { result } = simnet.callPublicFn(
      "user-registry",
      "register-user",
      [Cl.none()],
      wallet2
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("updates BNS name on re-registration without resetting stats", () => {
    // First register
    simnet.callPublicFn("user-registry", "register-user", [Cl.some(Cl.stringAscii("old.btc"))], wallet1);
    // Give some stats
    simnet.callPublicFn(
      "user-registry",
      "update-user-stats",
      [Cl.principal(wallet1), Cl.bool(true), Cl.uint(5n)],
      deployer
    );
    // Re-register with new name
    const { result } = simnet.callPublicFn(
      "user-registry",
      "register-user",
      [Cl.some(Cl.stringAscii("new.btc"))],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));

    const user = simnet.callReadOnlyFn("user-registry", "get-user", [Cl.principal(wallet1)], deployer);
    expect(user.result).toBeTuple({
      "bns-name": Cl.some(Cl.stringAscii("new.btc")),
      wins: Cl.uint(1),
      losses: Cl.uint(0),
      clout: Cl.uint(5),
    });
  });

  it("allows any Stacks principal to register", () => {
    const { result } = simnet.callPublicFn(
      "user-registry",
      "register-user",
      [Cl.some(Cl.stringAscii("anyone.btc"))],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });
});

describe("user-registry: update-user-stats", () => {
  it("records a win and adds clout for a Stacks user", () => {
    simnet.callPublicFn("user-registry", "register-user", [Cl.none()], wallet1);

    const { result } = simnet.callPublicFn(
      "user-registry",
      "update-user-stats",
      [Cl.principal(wallet1), Cl.bool(true), Cl.uint(10n)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));

    const user = simnet.callReadOnlyFn("user-registry", "get-user", [Cl.principal(wallet1)], deployer);
    expect(user.result).toBeTuple({
      "bns-name": Cl.none(),
      wins: Cl.uint(1),
      losses: Cl.uint(0),
      clout: Cl.uint(10),
    });
  });

  it("records a loss and adds clout for a Stacks user", () => {
    simnet.callPublicFn("user-registry", "register-user", [Cl.none()], wallet2);

    simnet.callPublicFn(
      "user-registry",
      "update-user-stats",
      [Cl.principal(wallet2), Cl.bool(false), Cl.uint(2n)],
      deployer
    );

    const user = simnet.callReadOnlyFn("user-registry", "get-user", [Cl.principal(wallet2)], deployer);
    expect(user.result).toBeTuple({
      "bns-name": Cl.none(),
      wins: Cl.uint(0),
      losses: Cl.uint(1),
      clout: Cl.uint(2),
    });
  });

  it("fails when caller is not the contract owner", () => {
    const { result } = simnet.callPublicFn(
      "user-registry",
      "update-user-stats",
      [Cl.principal(wallet2), Cl.bool(true), Cl.uint(10n)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(401)); // err-unauthorized
  });

  it("accumulates stats across multiple Stacks battles", () => {
    simnet.callPublicFn("user-registry", "update-user-stats", [Cl.principal(wallet1), Cl.bool(true), Cl.uint(10n)], deployer);
    simnet.callPublicFn("user-registry", "update-user-stats", [Cl.principal(wallet1), Cl.bool(true), Cl.uint(10n)], deployer);
    simnet.callPublicFn("user-registry", "update-user-stats", [Cl.principal(wallet1), Cl.bool(false), Cl.uint(2n)], deployer);

    const user = simnet.callReadOnlyFn("user-registry", "get-user", [Cl.principal(wallet1)], deployer);
    expect(user.result).toBeTuple({
      "bns-name": Cl.none(),
      wins: Cl.uint(2),
      losses: Cl.uint(1),
      clout: Cl.uint(22),
    });
  });
});

describe("user-registry: get-user", () => {
  it("returns default values for an unregistered Stacks principal", () => {
    const { result } = simnet.callReadOnlyFn(
      "user-registry",
      "get-user",
      [Cl.principal(wallet2)],
      wallet2
    );
    expect(result).toBeTuple({
      "bns-name": Cl.none(),
      wins: Cl.uint(0),
      losses: Cl.uint(0),
      clout: Cl.uint(0),
    });
  });

  it("returns stored data for a registered Stacks user", () => {
    simnet.callPublicFn("user-registry", "register-user", [Cl.some(Cl.stringAscii("clash.btc"))], wallet1);

    const { result } = simnet.callReadOnlyFn("user-registry", "get-user", [Cl.principal(wallet1)], deployer);
    expect(result).toBeTuple({
      "bns-name": Cl.some(Cl.stringAscii("clash.btc")),
      wins: Cl.uint(0),
      losses: Cl.uint(0),
      clout: Cl.uint(0),
    });
  });

  it("is callable by any principal on the Stacks network", () => {
    const r1 = simnet.callReadOnlyFn("user-registry", "get-user", [Cl.principal(wallet1)], wallet2);
    const r2 = simnet.callReadOnlyFn("user-registry", "get-user", [Cl.principal(wallet1)], deployer);
    expect(r1.result).toEqual(r2.result);
  });
});
