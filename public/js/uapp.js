const formU = document.querySelector('form')

const updater = () => {
    if(formU){
    if(formU.id == 'updateUser'){
        updateUser()
    } else {
        
    }
}  

}

const updateUser = () => {
    formU.addEventListener('submit', (e) => {

    const uname = document.getElementById('uname').value
    const uemail = document.getElementById('uemail').value
    const uage = document.getElementById('uage').value

    fetch('/users/me', {method:'PATCH', body: JSON.stringify({
        name: uname,
        email: uemail,
        age: uage
        }),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }}).then(response => response.json())
    })
}

updater()

const deleter = () => {
    const deleteAcc = document.getElementById("delete")
    if(deleteAcc){
        deleteAcc.addEventListener("click", function(){
        const display = document.getElementById("display")
        const para = document.createElement('p')
        para.id = 'email'
        para.textContent = 'Are you sure you want to delete your account?'
        display.appendChild(para)
        const yes = document.createElement('input')
        yes.id = 'YES'
        yes.value = 'YES'
        yes.type = 'radio'
        yes.name = 'reply'
        var label = document.createElement('label')
        label.htmlFor = 'YES'
        label.textContent = 'Yes'
        display.appendChild(yes)
        display.appendChild(label)
        const no = document.createElement('input')
        no.id = 'NO'
        no.type = 'radio'
        no.value = 'NO'
        no.name = 'reply'
        display.appendChild(no)
        label = document.createElement('label')
        label.htmlFor = 'NO';
        label.textContent = 'No'
        display.appendChild(label)
        const confirm = document.createElement('button')
        confirm.value = 'Confirm'
        confirm.id='confirm'
        confirm.textContent = 'Confirm'
        confirm.classList.add('opts')
        display.appendChild(confirm)

        checkClick()
    })
    }
}

const checkClick = () => {
    const confirm = document.getElementById('confirm')
    console.log('confirm')
    if(confirm){
    confirm.addEventListener("click", function (){
        console.log('confirm')
        const getreply = document.getElementsByName('reply')
        console.log(getreply)
        const rbs = document.querySelectorAll('input[name="reply"]')
        console.log(rbs)
        for (const rb of rbs) {
            if (rb.checked) {
                selectedValue = rb.value;
                break;
            }
        }
        if(selectedValue == 'YES'){
        fetch('/users/me', { method: 'DELETE'})
        } 
    })}
}


deleter()





