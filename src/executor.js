/** @param {NS} ns */
export async function main(ns) {
    const [target, script] = ns.args
  
    if (!target) {
      ns.print("No server picked")
      ns.exit()
    }
    const targetServer = ns.getServer(target)
  
    const isCracked = ns.hasRootAccess(targetServer.hostname)
    if (!isCracked) {
      if (targetServer.numOpenPortsRequired > 0)
        ns.brutessh(targetServer.hostname)
  
      ns.nuke(targetServer.hostname)
    }
  
    ns.killall(targetServer.hostname)
    ns.scp(script, targetServer.hostname)
  
    const maxRam = ns.getServerMaxRam(targetServer.hostname)
    const usedRam = ns.getServerUsedRam(targetServer.hostname)
    const availableRam = maxRam - usedRam
    ns.print(`Available RAM: ${availableRam}`)
  
    const scriptRamCost = ns.getScriptRam(script, targetServer.hostname)
    ns.print(`${script} costs ${scriptRamCost}`)
  
    const threadsToUse = Math.floor(availableRam / scriptRamCost)
    ns.print(`Threads to use: ${threadsToUse}`)
  
    ns.exec(script, targetServer.hostname, { threads: threadsToUse }, threadsToUse)
  }