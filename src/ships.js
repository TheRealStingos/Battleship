function ship(size) {
    return {
        size: size,
        hits: 0,
        coords: null,
        hit(targetCoords) {
            if (this.coords === targetCoords) {
                this.hits += 1
            }
        },
        isSunk() {
            if (this.hits == this.size) {
                return true
            }
            else {
                return false
            }
        }
    }
}

module.exports = ship