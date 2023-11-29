/** @param {NS} ns */
export async function main(ns) {
    const [threads = 1] = ns.args
  
    const wrapInHeader = async (func, name) => {
      ns.print("")
      ns.print(`=== ${name} ===`)
      ns.print("")
      await func()
      ns.print("")
      ns.print(`=== ${name} ===`)
      ns.print("")
    }
  
    const hostname = ns.getHostname()
    const minSecLevel = ns.getServerMinSecurityLevel(hostname)
  
    const hitSec = async () => {
      const secLevel = ns.getServerSecurityLevel(hostname)
      ns.print(`SecLevel: ${secLevel}`)
  
      if (secLevel > 25) {
        ns.alert(`SecLevel is at ${secLevel} for ${hostname}`)
      }
  
      const weakenEffect = threads * 0.05
      const secLevelDiff = secLevel - weakenEffect
      if (secLevelDiff >= minSecLevel) {
        await ns.weaken(hostname)
      }
    }
  
    const hitMoney = async () => {
      await ns.grow(hostname)
      await ns.hack(hostname)
    }
  
    while (true) {
      await wrapInHeader(hitSec, "SecLevel")
      await wrapInHeader(hitMoney, "Hacking")
    }
  }