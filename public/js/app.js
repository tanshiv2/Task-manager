const real = document.querySelector('#tasks')
var str = real.textContent
real.textContent = ''

const makeArr = (str) => {
    let arr = []
    while(str!=''){
        arr.push(JSON.parse(str.slice(str.indexOf('{'), str.indexOf('}')+1)))
        str = str.substring(str.indexOf('}') + 2, str.length);
    }
    return arr
}

const timeCreated = (createdAt) => {
    const createdAt_ = new Date(createdAt)
    const currTime = new Date()
    // console.log(createdAt)
    const t = currTime - createdAt_;
    // console.log(currTime)
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
    // console.log(dueDate)
    // console.log('set' + set)
    const dueTime = dateTime.getHours() + ':' + dateTime.getMinutes()
    // console.log(dueTime)
    return dueDate + ' ' + dueTime
}


const makeDiv = (desc,completed,due,createdAt,id) => {
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
    const pending = document.createElement('img')
    if(!completed){
        Box.classList.add('red')
        field.textContent = 'Pending'
       
        pending.setAttribute('src','/images/caution.png')
        pending.setAttribute('id', 'small')
        update.setAttribute('src','/images/markdone.png')
    } else {
        Box.classList.add('green')
        field.textContent = 'Done'
        pending.setAttribute('src','/images/done.png')
        pending.setAttribute('id', 'small')
        update.setAttribute('src','/images/marknotdone.png')
    }
    right.appendChild(pending)
    right.appendChild(field)

    update.setAttribute('id', id)

    anchor.setAttribute('href','')
    anchor1.setAttribute('href','')
    anchor2.setAttribute('href','')

    anchor.setAttribute('id','update')
    anchor1.setAttribute('id','modify')
    anchor2.setAttribute('id','delete')

    field = document.createElement('div')
    field.setAttribute('id', 'created')
    field.textContent = 'created ' + timeCreated(createdAt) + 'ago'
    right.appendChild(field)

    const icons = document.createElement('div')
    icons.classList.add('images')

    const modify = document.createElement('img')
    modify.setAttribute('src','/images/modify.png')
    modify.setAttribute('id', id)

    const del = document.createElement('img')
    del.setAttribute('src','/images/delete1.webp')
    del.setAttribute('id', id)
   
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
        const Box = makeDiv(task.description, task.completed, task.due, task.createdAt, task._id)
        display.appendChild(Box)
                
    })
}

const arr = makeArr(str)
displayTasks(arr)

const fetchdelete = (id) => {
    fetch('/tasks/'+ id, { method: 'DELETE'})
}

const fetchpatch = (bool,id) => {fetch('/tasks/' + id, {method:'PATCH', body: JSON.stringify({
    completed: bool
    }),
    headers: {
    "Content-type": "application/json; charset=UTF-8"
    }}).then(response => response.json())
}

const applyAction = () => {
    var act = []
    act = document.getElementsByTagName('img')
    console.log(act.length)
    for ( var i = 0; i < act.length; i++) {
        console.log(act[i].src)
        act[i].addEventListener("click", function () {
            var fetch = true
            console.log(this.id)
            if(this.src.endsWith("/images/marknotdone.png")){
                console.log(this.src)
                fetch = false
                return fetchpatch(fetch,this.id)
            }
            else if(this.src.endsWith("/images/delete1.webp")){
                    console.log('delete yaar')
                    fetchdelete(this.id)
            } else if(this.src.endsWith("/images/markdone.png")){
                fetch = true
                return fetchpatch(fetch,this.id)
            } 
             else {
                console.log('ye sahi hai')
                console.log('donothing')
            }
        })
    }
}

applyAction()



