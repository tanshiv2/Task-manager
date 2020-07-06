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

    const anchor = document.createElement('a')
    const anchor1 = document.createElement('a')
    const anchor2 = document.createElement('a')

    const update = document.createElement('img')

    if(!completed){
        Box.classList.add('red')
        field.textContent = 'Pending'
        update.setAttribute('src','/images/markdone.png')
    } else {
        Box.classList.add('green')
        field.textContent = 'Done'
        update.setAttribute('src','/images/marknotdone.png')
    }
    right.appendChild(field)

    anchor.setAttribute('href','/tasks')
    anchor1.setAttribute('href','/tasks/modify')
    anchor2.setAttribute('href','/tasks')

    field = document.createElement('div')
    field.setAttribute('id', 'created')
    field.textContent = 'created ' + timeCreated(createdAt) + 'ago'
    // field.textContent = createdAt
    right.appendChild(field)

    const icons = document.createElement('div')
    icons.classList.add('images')

    const modify = document.createElement('img')
    modify.setAttribute('src','/images/modify.png')

    const del = document.createElement('img')
    del.setAttribute('src','/images/delete.png')

   
    anchor.appendChild(update)
    anchor1.appendChild(modify)
    anchor2.appendChild(del)

    icons.appendChild(anchor)
    icons.appendChild(anchor1)
    icons.appendChild(anchor2)

    Box.appendChild(left)
    Box.appendChild(right)
    Box.appendChild(icons)
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


const fetchid = () => fetch('/tasks/5f021eedef0c4251206ebb75', {method: 'PATCH', body: JSON.stringify({
    completed: false
    }),
    headers: {
    "Content-type": "application/json; charset=UTF-8"
    }}).then(response => response.json())

fetchid()


const applyAction = () => {
    const action = document.querySelector('img')
    action.addEventListener("click", function (fetch,meth) {
    var fetch
    var meth
    if(action.src == '/images/marknotdone.png'){
        fetch = false
        meth = 'PATCH'
    } else if(action.src == '/images/markdone.png'){
        fetch = true
        meth = 'PATCH'
    } else if(action.src == '/images/delete.png'){
        meth = 'DELETE'
    } else {
        meth = 'PATCH'
    }
})
}

applyAction()



