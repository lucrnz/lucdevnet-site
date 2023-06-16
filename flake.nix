{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";
  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem
    (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs-18_x
          pkgs.nodePackages.npm
          pkgs.nodePackages.typescript
          pkgs.nodePackages.typescript-language-server
        ];
      };
    });
}
