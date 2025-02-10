{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
 pkgs.php82
		pkgs.php
	

  ];
  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
    "ikappas.phpcs"
    "shevaua.phpcs"
    "DEVSENSE.composer-php-vscode"
    "DEVSENSE.intelli-php-vscode"
    "DEVSENSE.phptools-vscode"
    "DEVSENSE.profiler-php-vscode"
    "ikappas.composer"
    "StoilDobreff.php-resolver"
    
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "start"
        ];
        env = {
          PORT = "$PORT";
        };
        manager = "web";
      };
    };
  };
}