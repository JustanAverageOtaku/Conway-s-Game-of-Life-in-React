import { useCallback, useRef, useState } from 'react';

const numCols = 40;
const numRows = 20;

const neighbours = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, -1],
	[0, 1],
	[1, -1],
	[1, 0],
	[1, 1],
];

function generateGrid() {
	let grid = [];
	for (let i = 0; i < numRows; i++) {
		grid.push(Array.from(Array(numCols), () => 0));
	}
	return grid;
}

function copyGrid(grid) {
	return grid.map((arr) => arr.slice());
}

function getNeighbours(grid, i, j) {
	let numNeighbours = 0;
	neighbours.map((n) => {
		const realI = i + n[1];
		const realJ = j + n[0];
		if (realI >= 0 && realI < numRows && realJ >= 0 && realJ < numCols)
			numNeighbours += grid[realI][realJ];
	});
	//console.log(numNeighbours);
	return numNeighbours;
}

function getNextGen(grid) {
	let newGrid = copyGrid(grid);
	for (let i = 0; i < numRows; i++) {
		for (let j = 0; j < numCols; j++) {
			const neighbours = getNeighbours(grid, i, j);
			if (neighbours < 2 || neighbours > 3) newGrid[i][j] = 0;
			if (neighbours === 3) newGrid[i][j] = 1;
		}
	}
	return newGrid;
}

export default function App() {
	const [grid, setGrid] = useState(generateGrid());
	const [running, setRunning] = useState(false);
	const [gen, setGen] = useState(0);
	const [speed, setSpeed] = useState(50);

	const runningRef = useRef(running);
	runningRef.current = running;

	const speedRef = useRef(speed);
	speedRef.current = speed;

	function handleToggleTile(i, j) {
		let newGrid = copyGrid(grid);
		newGrid[i][j] = newGrid[i][j] ? 0 : 1;
		setGrid(newGrid);
	}

	function handleToggleRunning() {
		setRunning(!running);
		if (!running) {
			runningRef.current = true;
			runSimulation();
		}
	}

	function handleClear() {
		setGrid(generateGrid());
		setGen(0);
	}

	const runSimulation = useCallback(() => {
		if (!runningRef.current) return;
		setGrid((current) => {
			const nextGen = getNextGen(current);
			if (JSON.stringify(current) === JSON.stringify(nextGen)) {
				setRunning(false);
			}
			return getNextGen(current);
		});
		setGen((gen) => gen + 1);
		setTimeout(runSimulation, 1000 - speedRef.current * 10);
	}, []);

	return (
		<div style={{ display: 'grid', justifyContent: 'center', backgroundColor: '#2E0249', marginTop: '0' }}>
			<h1 style={{ textAlign: 'center', color: '#F806CC' }}>Conway's Game of Life</h1>
			<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
				<button style={{ width: '6rem', height: '2rem', backgroundColor: '#F582A7', border: '0px', borderRadius: '10px' }} className='btn btn-success' onClick={handleToggleRunning}>
					{running ? 'Stop' : 'Start'}
				</button>
				<button
					style={{ width: '6rem', height: '2rem', backgroundColor: '#F582A7', border: '0px', borderRadius: '10px' }}
					className='btn btn-danger'
					onClick={handleClear}
					disabled={runningRef.current}
				>
					Clear
				</button>
			</div>
			<div
				style={{
					display: 'flex',
					gap: '4rem',
					justifyContent: 'space-between',
					alignItems: 'end',
					marginTop: '1rem',
					marginBottom: '1rem',
				}}
			>
				<h3 style={{ width: `${100 / 3}%`, color: '#F806CC' }}>Generation: {gen}</h3>
			</div>
			<div
				style={{
					display: 'grid',
					justifyContent: 'center',
					gridTemplateColumns: `repeat(${numCols}, 2rem)`,
				}}
			>
				{grid.map((row, i) =>
					row.map((col, j) => (
						<div
							key={`${i},${j}`}
							onClick={() => handleToggleTile(i, j)}
							style={{
								width: '2rem',
								height: '2rem',
								borderTop: '2px solid black',
								borderLeft: '2px solid black',
								borderRight: j === numCols - 1 ? '2px solid black' : undefined,
								borderBottom: i === numRows - 1 ? '2px solid black' : undefined,
                borderColor: '#A91079',
								background: col ? '#F73D93' : undefined,
							}}
						/>
					))
				)}
			</div>
		</div>
	);
}