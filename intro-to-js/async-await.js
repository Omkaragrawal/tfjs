// // --------------------------- Async - Await ---------------------------//


const ioFunction = async (parameters) => {
    console.log('Inside I/O function, before I/O operation\n Execution');

    setTimeout(() => {
        console.log("I/O operation performed");
    }, 3000)

    console.log("After I/O operation inside I/O function");
}
let second;
async function generalFunction(parametrs) {
    let value = await ioFunction();
    console.log("After I/O function call, inside parent function");
    second = await ioFunction();
}

console.log('Execution start'); 

(async () => {
    await generalFunction();
})();