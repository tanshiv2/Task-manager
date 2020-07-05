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

const dueDate = (due) => {
    const dateTime = new Date(due)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dueDate = dateTime.getDate() + ' ' + monthNames[dateTime.getMonth()]
    const set = new Date()
    set.setMonth(dateTime.getMonth())
    set.setDate(dateTime.getDate())
    console.log(dueDate)
    console.log('set' + set)
    const dueTime = dateTime.getHours() + ':' + dateTime.getMinutes()
    console.log(dueTime)
    return dueDate + ' ' + dueTime
}


const makeDiv = (desc,completed,due,createdAt) => {
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


    var field = document.createElement('div')
    field.setAttribute('id', 'due')
    field.textContent = 'Due: ' + dueDate(due)
    left.appendChild(field)

    field = document.createElement('div')
    field.setAttribute('id', 'completed')
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
        const Box = makeDiv(task.description, task.completed, task.due, task.createdAt)
        display.appendChild(Box)
                
    })
}

const arr = makeArr(str)
displayTasks(arr)


