const fs = require('fs');

function decodeNumber(base, numberStr) {
    return BigInt(parseInt(numberStr, base));
}

function findSecret(testData) {
    const k = parseInt(testData.keys.k); 

    let points = Object.entries(testData)
        .filter(([key]) => key !== "keys") 
        .map(([x, data]) => ({
            x: BigInt(x), 
            y: decodeNumber(parseInt(data.base), data.value)
        }))
        points.sort((a, b) => (a.x < b.x ? -1 : a.x > b.x ? 1 : 0));

    
    let selectedPoints = points.slice(0, k);
    let secret = BigInt(0);

    
    for (let i = 0; i < k; i++) {
        let { x: xi, y: yi } = selectedPoints[i];
        let numerator = BigInt(1), denominator = BigInt(1);

        for (let j = 0; j < k; j++) {
            if (i === j) continue;
            let xj = selectedPoints[j].x;
            numerator *= -xj;
            denominator *= (xi - xj);
        }

        secret += (yi * numerator) / denominator;
    }

    return secret.toString();
}


function main() {
    ["testcase1.json", "testcase2.json"].forEach(filename => {
        const testData = JSON.parse(fs.readFileSync(filename, 'utf8'));
        console.log(`Secret for ${filename}:`, findSecret(testData));
    });
}

main();
