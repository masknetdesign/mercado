document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyBkrBLKuklZgPm1nz2G997ULiYycZMb9F8",
        authDomain: "avisoseeventos.firebaseapp.com",
        projectId: "avisoseeventos",
        storageBucket: "avisoseeventos.appspot.com",
        messagingSenderId: "247706769451",
        appId: "1:247706769451:web:ce31cd9d0ca22cd267b26e"
    };
    // Inicialização do Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    const profilePic = document.getElementById('profilePic');
    const profileName = document.getElementById('profileName');

    // Verificar autenticação do usuário
    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuário está logado, recuperar dados do Firestore
            const userId = user.uid;
            db.collection('users').doc(userId).get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    profileName.textContent = userData.name || 'Nome do Usuário';
                    profilePic.src = userData.photoURL || 'default-pic.jpg'; // Substitua 'default-pic.jpg' por uma imagem padrão se desejado
                } else {
                    console.log('Documento não encontrado!');
                }
            }).catch(error => {
                console.log('Erro ao obter documento:', error);
            });
        } else {
            // Usuário não está logado, redirecionar para a página de login
            window.location.href = 'login.html';
        }
    });
});
