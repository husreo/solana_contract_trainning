import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { First } from "../target/types/first";

describe("first", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.First as Program<First>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
