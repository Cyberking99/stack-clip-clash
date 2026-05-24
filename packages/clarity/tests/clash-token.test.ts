import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("clash-token: transfer", () => {
  it("transfers tokens from sender to recipient", () => {
    const amount = 500000n;
    simnet.callPublicFn("clash-token", "mint", [Cl.uint(amount), Cl.principal(wallet1)], deployer);

    const { result } = simnet.callPublicFn(
      "clash-token",
      "transfer",
      [Cl.uint(amount), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));

    const bal2 = simnet.callReadOnlyFn("clash-token", "get-balance", [Cl.principal(wallet2)], deployer);
    expect(bal2.result).toBeOk(Cl.uint(amount));
  });

  it("fails transfer when tx-sender is not the sender principal", () => {
    const amount = 100n;
    simnet.callPublicFn("clash-token", "mint", [Cl.uint(amount), Cl.principal(wallet1)], deployer);

    const { result } = simnet.callPublicFn(
      "clash-token",
      "transfer",
      [Cl.uint(amount), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()],
      wallet2 // wallet2 tries to transfer wallet1's tokens
    );
    expect(result).toBeErr(Cl.uint(101)); // err-not-token-owner
  });

  it("fails transfer when sender has insufficient balance", () => {
    const { result } = simnet.callPublicFn(
      "clash-token",
      "transfer",
      [Cl.uint(999999999n), Cl.principal(wallet2), Cl.principal(wallet1), Cl.none()],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(1)); // standard FT insufficient funds
  });

  it("transfers with memo attached", () => {
    const amount = 200000n;
    simnet.callPublicFn("clash-token", "mint", [Cl.uint(amount), Cl.principal(wallet1)], deployer);

    const { result } = simnet.callPublicFn(
      "clash-token",
      "transfer",
      [Cl.uint(amount), Cl.principal(wallet1), Cl.principal(wallet2), Cl.some(Cl.buffer(Buffer.from("clash")))],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));
  });
});

describe("clash-token: mint", () => {
  it("mints tokens to a recipient when called by owner", () => {
    const amount = 1000000n;
    const { result } = simnet.callPublicFn(
      "clash-token",
      "mint",
      [Cl.uint(amount), Cl.principal(wallet1)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));

    const bal = simnet.callReadOnlyFn("clash-token", "get-balance", [Cl.principal(wallet1)], deployer);
    expect(bal.result).toBeOk(Cl.uint(amount));
  });

  it("fails to mint when caller is not the contract owner", () => {
    const { result } = simnet.callPublicFn(
      "clash-token",
      "mint",
      [Cl.uint(1000n), Cl.principal(wallet2)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(100)); // err-owner-only
  });

  it("increases total supply after minting", () => {
    const amount = 5000000n;
    const supplyBefore = simnet.callReadOnlyFn("clash-token", "get-total-supply", [], deployer);

    simnet.callPublicFn("clash-token", "mint", [Cl.uint(amount), Cl.principal(wallet1)], deployer);

    const supplyAfter = simnet.callReadOnlyFn("clash-token", "get-total-supply", [], deployer);
    const before = (supplyBefore.result as any).value.value;
    const after = (supplyAfter.result as any).value.value;
    expect(after - before).toBe(amount);
  });

  it("mints to deployer itself", () => {
    const amount = 250000n;
    const { result } = simnet.callPublicFn(
      "clash-token",
      "mint",
      [Cl.uint(amount), Cl.principal(deployer)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });
});

describe("clash-token: get-name", () => {
  it("returns the correct token name", () => {
    const { result } = simnet.callReadOnlyFn("clash-token", "get-name", [], deployer);
    expect(result).toBeOk(Cl.stringAscii("ClipClash Token"));
  });

  it("returns the same name regardless of caller", () => {
    const r1 = simnet.callReadOnlyFn("clash-token", "get-name", [], wallet1);
    const r2 = simnet.callReadOnlyFn("clash-token", "get-name", [], wallet2);
    expect(r1.result).toBeOk(Cl.stringAscii("ClipClash Token"));
    expect(r2.result).toBeOk(Cl.stringAscii("ClipClash Token"));
  });
});
