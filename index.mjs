function fromCondition(condition, resolveTo, rejectTo) {
  return condition ? Promise.resolve(resolveTo) : Promise.reject(rejectTo)
}

function fromNullable(nullable, rejectTo) {
  return nullable !== null && nullable !== undefined
    ? Promise.resolve(nullable)
    : Promise.reject(rejectTo)
}

export default { fromCondition, fromNullable }
