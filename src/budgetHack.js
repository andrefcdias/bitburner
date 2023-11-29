/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 1) {
      ns.print(`Wrong number of args provided, needs only hostname`)
      ns.print(`Args: ${ns.args.join(' ')}`)
    }
  
    const hostname = ns.args[0]
    while (true) {
      await ns.grow(hostname)
      await ns.hack(hostname)
    }
  }