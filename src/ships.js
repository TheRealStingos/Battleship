function ship(name, size) {
    return {
        name: name,
        size: size,
        hits: 0,
        coords: new Array(size).fill(null),
        hit(targetCoords) {
            if (this.coords.includes(targetCoords)) {
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

export default ship