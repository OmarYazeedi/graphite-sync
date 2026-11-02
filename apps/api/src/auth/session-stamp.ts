/// How stale an AuthSession's `lastUsedAt` may be while the session is in
/// use: the guard (jwt.strategy) writes the stamp at most once per this
/// interval, so a session used a minute ago can still read as ten minutes
/// old.
///
/// ITS OWN FILE because a reader outside this server needs the same number.
/// The Obsidian plugin's device list (row 2376) says "seen in the last ten
/// minutes" for any stamp younger than this, never "now" — a list built on a
/// throttled stamp cannot tell a device using the account this second from
/// one that stopped nine minutes ago. The plugin imports this constant, so
/// the day the throttle changes, its wording changes with it.
export const SESSION_STAMP_EVERY_MS = 10 * 60 * 1000;
