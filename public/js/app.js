const real = document.querySelector('#tasks')
var str = real.textContent
real.textContent = ''

const makeArr = (str) => {
    let arr = []
    while(str!=''){
        //JSON.parse(str.slice(str.indexOf('{'), str.indexOf('}')+1))
        arr.push(JSON.parse(str.slice(str.indexOf('{'), str.indexOf('}')+1)))
        str = str.substring(str.indexOf('}') + 2, str.length);
    }
    return arr
}

// const makeDiv = (desc,completed,createdAt) => {
//     const Box = document.createElement('div')
//     Box.setAttribute('class', 'task')
//     var field = document.createElement('div')
//     field.setAttribute('id', 'desc')
//     field.textContent = desc
//     // const p = document.createElement('h4')
//     // p.textContent = desc
//     Box.appendChild(field)
//     field = document.createElement('div')
//     if(!completed){
//         // field.setAttribute('id','red')
//         Box.classList.add('red')
//     } else {
//     // field.setAttribute('id', 'green')
//         Box.classList.add('green')
//     }
//     field.textContent = completed
//     Box.appendChild(field)
//     field = document.createElement('div')
//     field.setAttribute('id', 'created')
//     field.textContent = createdAt
//     Box.appendChild(field)
//     return Box
// }
const timeCreated = (createdAt) => {
    const createdAt_ = new Date(createdAt)
    const currTime = new Date()
    console.log(createdAt)
    const t = currTime - createdAt_;
    console.log(currTime)
    var days = Math.floor(t / (1000 * 60 * 60 * 24));

    if(days<1){
        var hours = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60));
        if(hours<1){
            var minutes = Math.floor((t % (1000 * 60 * 60))/(1000 * 60));
            if (minutes<1){
                var seconds = Math.floor((t % (1000 * 60))/1000);
                return seconds + ' seconds '
            } else if(minutes>1){
                return minutes + ' minutes '
            } else {
                return minutes + ' minute '
            }
        } else if(hours>1){
            return hours + ' hours '
        } else {
            return hours + ' hour '
        }
    } else if(days>1){
        return days + ' days '
    } else {
        return days + ' day '
    }
}


const makeDiv = (desc,completed,createdAt) => {
    const Box = document.createElement('div')
    Box.setAttribute('class', 'task')
    const left = document.createElement('div')
    left.setAttribute('class', 'left')
    const right = document.createElement('div')
    right.setAttribute('class','right')

    var field = document.createElement('div')
    field.setAttribute('id', 'desc')
    field.textContent = desc
    left.appendChild(field)

    field = document.createElement('div')
    if(!completed){
        Box.classList.add('red')
        field.textContent = 'Pending'
    } else {
        Box.classList.add('green')
        field.textContent = 'Done'
    }
    right.appendChild(field)

    field = document.createElement('div')
    field.setAttribute('id', 'created')
    field.textContent = 'created ' + timeCreated(createdAt) + 'ago'
    // field.textContent = createdAt
    right.appendChild(field)

    Box.appendChild(left)
    Box.appendChild(right)
    return Box
}

const displayTasks = (arr) => {
    const display = document.querySelector('#display')
    arr.forEach((task) => {
        const Box = makeDiv(task.description, task.completed, task.createdAt)
        display.appendChild(Box)
                
    })
}

const arr = makeArr(str)
displayTasks(arr)
// console.log(arr)