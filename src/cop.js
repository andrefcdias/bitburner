/** @param {NS} ns */
export async function main(ns) {
    const [threadsToUse] = ns.args
    const hostname = ns.getHostname()
    const minSecLevel = ns.getServerMinSecurityLevel(hostname)
  
    await ns.sleep(3000)
    
    while (true) {
      const secLevel = ns.getServerSecurityLevel(hostname)
      if (secLevel < minSecLevel + (threadsToUse * 0.05)) {
        ns.print(`Cop has arrested ${hostname}! >:)`)
        ns.alert(`Cop has arrested ${hostname}! >:)`)
        ns.exit()
      }
  
      await ns.weaken(hostname)
    }
  }