import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("clash-token tests", () => {
  it("returns the correct token metadata", () => {
    const name = simnet.callReadOnlyFn("clash-token", "get-name", [], deployer);
    const symbol = simnet.callReadOnlyFn("clash-token", "get-symbol", [], deployer);
    const decimals = simnet.callReadOnlyFn("clash-token", "get-decimals", [], deployer);

    expect(name.result).toBeOk(Cl.stringAscii("ClipClash Token"));
    expect(symbol.result).toBeOk(Cl.stringAscii("CLASH"));
    expect(decimals.result).toBeOk(Cl.uint(6));
  });

  it("mints tokens to a recipient (owner only)", () => {
    const mintAmount = 1000000n;

    // Mint from deployer (owner)
    const { result: mintResult } = simnet.callPublicFn(
      "clash-token",
      "mint",
      [Cl.uint(mintAmount), Cl.principal(wallet1)],
      deployer
    );
    expect(mintResult).toBeOk(Cl.bool(true));

    const { result: balanceResult } = simnet.callReadOnlyFn(
      "clash-token",
      "get-balance",
      [Cl.principal(wallet1)],
      deployer
    );
    expect(balanceResult).toBeOk(Cl.uint(mintAmount));
  });

  it("fails to mint tokens if not owner", () => {
    const mintAmount = 1000000n;

    const { result } = simnet.callPublicFn(
      "clash-token",
      "mint",
      [Cl.uint(mintAmount), Cl.principal(wallet2)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(100)); // err-owner-only
  });

  it("transfers tokens between accounts", () => {
    const mintAmount = 2000000n;
    const transferAmount = 500000n;

    // Mint to wallet1 first
    simnet.callPublicFn(
      "clash-token",
      "mint",
      [Cl.uint(mintAmount), Cl.principal(wallet1)],
      deployer
    );

    // Transfer from wallet1 to wallet2
    const { result } = simnet.callPublicFn(
      "clash-token",
      "transfer",
      [
        Cl.uint(transferAmount),
        Cl.principal(wallet1),
        Cl.principal(wallet2),
        Cl.none()
      ],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));

    // Check balances
    const balance1 = simnet.callReadOnlyFn("clash-token", "get-balance", [Cl.principal(wallet1)], deployer);
    const balance2 = simnet.callReadOnlyFn("clash-token", "get-balance", [Cl.principal(wallet2)], deployer);

    expect(balance1.result).toBeOk(Cl.uint(mintAmount - transferAmount));
    expect(balance2.result).toBeOk(Cl.uint(transferAmount));
  });

  it("fails to transfer more than balance", () => {
    const transferAmount = 100n;
    // wallet2 has 0 balance at start of this test
    const { result } = simnet.callPublicFn(
      "clash-token",
      "transfer",
      [
        Cl.uint(transferAmount),
        Cl.principal(wallet2),
        Cl.principal(wallet1),
        Cl.none()
      ],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(1)); // Standard FT error for insufficient funds
  });
});
