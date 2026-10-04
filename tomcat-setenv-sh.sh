#!/bin/sh
# ═══════════════════════════════════════════════════════════════════
# bin/setenv.sh — JVM and environment tuning for Tomcat
#
# Tomcat sources this file automatically at startup (if it exists).
# Create it at: $CATALINA_HOME/bin/setenv.sh
# Make it executable: chmod +x $CATALINA_HOME/bin/setenv.sh
#
# Use CATALINA_OPTS for Tomcat-only JVM options (recommended).
# Use JAVA_OPTS if you need options applied to ALL java commands
# on this host (including the shutdown script — avoid this).
# ═══════════════════════════════════════════════════════════════════

# ── JVM: heap memory ────────────────────────────────────────────────
# -Xms = initial heap size (pre-allocate to avoid slow growth on startup)
# -Xmx = max heap size    (set equal to Xms in production for predictability)
# Rule of thumb: leave ~25% of RAM for OS + off-heap (NIO buffers, Metaspace)
# Example for a 4 GB server: Xms=1g Xmx=2g (leaves 2 GB for OS + native)

CATALINA_OPTS="$CATALINA_OPTS -Xms512m"
CATALINA_OPTS="$CATALINA_OPTS -Xmx2g"

# ── JVM: Metaspace (class definitions) ──────────────────────────────
# Metaspace replaced PermGen in Java 8+. It lives in native memory.
# Without a cap it can grow unbounded — always set MaxMetaspaceSize.
CATALINA_OPTS="$CATALINA_OPTS -XX:MetaspaceSize=128m"
CATALINA_OPTS="$CATALINA_OPTS -XX:MaxMetaspaceSize=512m"

# ── JVM: Garbage Collector ──────────────────────────────────────────
# G1GC = recommended for most Tomcat workloads (Java 9+ default).
# Balances throughput vs pause time. Good up to ~8 GB heap.
CATALINA_OPTS="$CATALINA_OPTS -XX:+UseG1GC"

# Target max GC pause time in milliseconds. G1 will tune region sizes
# to try to hit this target. Lower = more frequent GC cycles.
CATALINA_OPTS="$CATALINA_OPTS -XX:MaxGCPauseMillis=200"

# For heaps > 8 GB, consider ZGC instead:
# CATALINA_OPTS="$CATALINA_OPTS -XX:+UseZGC"

# ── JVM: Crash & OOM diagnostics ────────────────────────────────────
# Dump heap on OutOfMemoryError (analyse with Eclipse MAT / VisualVM)
CATALINA_OPTS="$CATALINA_OPTS -XX:+HeapDumpOnOutOfMemoryError"
CATALINA_OPTS="$CATALINA_OPTS -XX:HeapDumpPath=/var/log/tomcat/heapdump-$(hostname)-$(date +%Y%m%d).hprof"

# Print GC details to a file (useful for tuning — disable in steady-state prod)
# CATALINA_OPTS="$CATALINA_OPTS -Xlog:gc*:file=/var/log/tomcat/gc.log:time,uptime:filecount=5,filesize=20m"

# ── JVM: Security / performance fixes ───────────────────────────────
# Fix slow SecureRandom on Linux (blocks on /dev/random by default).
# /dev/./urandom bypasses the check that blocks Java from using urandom directly.
CATALINA_OPTS="$CATALINA_OPTS -Djava.security.egd=file:/dev/./urandom"

# Ensure consistent character encoding across all platform calls
CATALINA_OPTS="$CATALINA_OPTS -Dfile.encoding=UTF-8"
CATALINA_OPTS="$CATALINA_OPTS -Duser.timezone=UTC"        # always run in UTC
CATALINA_OPTS="$CATALINA_OPTS -Duser.language=en"
CATALINA_OPTS="$CATALINA_OPTS -Duser.country=US"

# ── JVM: JMX (remote monitoring with VisualVM / JConsole) ───────────
# Enable only on a trusted network! No auth by default.
# CATALINA_OPTS="$CATALINA_OPTS -Dcom.sun.management.jmxremote"
# CATALINA_OPTS="$CATALINA_OPTS -Dcom.sun.management.jmxremote.port=9090"
# CATALINA_OPTS="$CATALINA_OPTS -Dcom.sun.management.jmxremote.ssl=false"
# CATALINA_OPTS="$CATALINA_OPTS -Dcom.sun.management.jmxremote.authenticate=true"
# CATALINA_OPTS="$CATALINA_OPTS -Dcom.sun.management.jmxremote.password.file=$CATALINA_HOME/conf/jmxremote.password"
# CATALINA_OPTS="$CATALINA_OPTS -Dcom.sun.management.jmxremote.access.file=$CATALINA_HOME/conf/jmxremote.access"

# ── JVM: Production server flag ─────────────────────────────────────
# -server enables HotSpot server JIT compiler (more aggressive optimizations,
# longer warm-up but much better steady-state throughput).
CATALINA_OPTS="$CATALINA_OPTS -server"

# ── Application-specific system properties ──────────────────────────
# Pass config values to your app without hardcoding them:
CATALINA_OPTS="$CATALINA_OPTS -Dapp.env=production"
CATALINA_OPTS="$CATALINA_OPTS -Dapp.config.dir=/etc/myapp"
# CATALINA_OPTS="$CATALINA_OPTS -Ddb.url=jdbc:mysql://db-host:3306/mydb"
# CATALINA_OPTS="$CATALINA_OPTS -Ddb.username=appuser"
# CATALINA_OPTS="$CATALINA_OPTS -Ddb.password=${DB_PASSWORD}"   # from env var

# ── Native library path (APR connector) ─────────────────────────────
# If you compiled the APR native library for faster TLS / file serving:
# CATALINA_OPTS="$CATALINA_OPTS -Djava.library.path=/usr/local/apr/lib"

# ── Summary of final CATALINA_OPTS ──────────────────────────────────
# Uncomment to debug startup — prints all JVM options at launch:
# echo "[setenv.sh] CATALINA_OPTS = $CATALINA_OPTS"

# ── Export ──────────────────────────────────────────────────────────
export CATALINA_OPTS

# ── Quick memory calculator ─────────────────────────────────────────
# Rough formula:
#   Xmx = (avg request memory in MB × maxThreads) + headroom (512 MB)
# Example: 2 MB/req × 200 threads + 512 MB = ~912 MB → round up to 1 GB
