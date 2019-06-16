const nameField = document.getElementById('username');
const submitButton = document.getElementById('submit');
const loginForm = document.getElementById('login');

import runGame from './runGame'

const setupLogin = () => {

    submitButton.onclick = () => {
        var name = nameField.value;

        if (name == null || name.length == 0) {
            alert('enter name please');
            return;
        }

        loginForm.remove();
        runGame(name);
    }
}

export default setupLogin;