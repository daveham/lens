#   ----------------------------------------------------------------
#   Set Paths
#   ----------------------------------------------------------------
    export PATH="$PATH:/usr/local/bin/"
    export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.local/bin:$HOME/bin"
  # Add `~/bin` to the `$PATH`
  # export PATH="$HOME/bin:$PATH";


#   ----------------------------------------------------------------
#   NETWORKING
#   ----------------------------------------------------------------

    alias myip='curl ip.appspot.com'                    # myip:         Public facing IP Address
    alias netCons='lsof -i'                             # netCons:      Show all open TCP/IP sockets
    alias flushdns='sudo discoveryutil mdnsflushcache'       # flushDNS:     Flush out the DNS Cache
    alias lsock='sudo /usr/sbin/lsof -i -P'             # lsock:        Display open sockets
    alias lsockU='sudo /usr/sbin/lsof -nP | grep UDP'   # lsockU:       Display only open UDP sockets
    alias lsockT='sudo /usr/sbin/lsof -nP | grep TCP'   # lsockT:       Display only open TCP sockets
    alias ipInfo0='ipconfig getpacket en0'              # ipInfo0:      Get info on connections for en0
    alias ipInfo1='ipconfig getpacket en1'              # ipInfo1:      Get info on connections for en1
    alias openPorts='sudo lsof -i | grep LISTEN'        # openPorts:    All listening connections
    alias showBlocked='sudo ipfw list'
    alias ipconfig="ipconfig getifaddr en0"
    alias ifconfig0="ipconfig getifaddr en0"
    alias en1="ipconfig getifaddr en1"

#   ----------------------------------------------------------------
#   Load the shell dotfiles, and then some:
#   * ~/.path can be used to extend `$PATH`.
#   * ~/.extra can be used for other settings you don’t want to commit.
#   ----------------------------------------------------------------
  for file in ~/.{path,bash_prompt,exports,aliases,functions,extra}; do
    [ -r "$file" ] && [ -f "$file" ] && source "$file";
  done;
  unset file;


#   ----------------------------------------------------------------
#   Case-insensitive globbing (used in pathname expansion)
#   ----------------------------------------------------------------
  shopt -s nocaseglob;


#   ----------------------------------------------------------------
#   Append to the Bash history file, rather than overwriting it
#   ----------------------------------------------------------------
  shopt -s histappend;


#   ----------------------------------------------------------------
#   Autocorrect typos in path names when using `cd`
#   ----------------------------------------------------------------
  shopt -s cdspell;

#   ----------------------------------------------------------------
#   Enable some Bash 4 features when possible:
#   * `autocd`, e.g. `**/qux` will enter `./foo/bar/baz/qux`
#   * Recursive globbing, e.g. `echo **/*.txt`
#   ----------------------------------------------------------------
  for option in autocd globstar; do
    shopt -s "$option" 2> /dev/null;
  done;
