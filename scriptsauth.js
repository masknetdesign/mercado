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

    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const showCadastroLink = document.getElementById('showCadastro');
    const showLoginLink = document.getElementById('showLogin');
    const userInfo = document.getElementById('userInfo');

    // Verificar se o usuário está autenticado ao carregar a página
    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuário está autenticado, exibir informações do usuário
            db.collection('users').doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    userInfo.innerHTML = `
                        <p>Bem-vindo(a), ${userData.nome}!</p>
                        <p>E-mail: ${userData.email}</p>
                    `;
                    loginForm.style.display = 'none';
                    cadastroForm.style.display = 'none';
                } else {
                    // Se o documento do usuário não existe no Firestore
                    alert('Erro: Dados do usuário não encontrados.');
                }
            }).catch(error => {
                console.error('Erro ao obter dados do usuário:', error);
                alert('Erro ao obter dados do usuário.');
            });
        } else {
            // Usuário não está autenticado, exibir formulários de login e cadastro
            loginForm.style.display = 'block';
            cadastroForm.style.display = 'none';
        }
    });

    // Event listener para exibir formulário de cadastro
    showCadastroLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        cadastroForm.style.display = 'block';
    });

    // Event listener para exibir formulário de login
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        cadastroForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Event listener para login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('emailLogin').value;
        const password = document.getElementById('passwordLogin').value;
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login bem sucedido, redireciona ou faz outras operações necessárias
                console.log('Usuário logado:', userCredential.user.email);
                window.location.href = 'index.html'; // Redireciona para a página principal
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(errorMessage);
                alert('Erro ao fazer login. Verifique suas credenciais.');
            });
    });

    // Event listener para cadastro
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('nomeCadastro').value;
        const email = document.getElementById('emailCadastro').value;
        const password = document.getElementById('passwordCadastro').value;
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Cadastro bem sucedido
                const user = userCredential.user;
                console.log('Usuário cadastrado:', user.email);

                // Salvar informações do usuário no Firestore
                return db.collection('users').doc(user.uid).set({
                    nome: nome,
                    email: email
                });
            })
            .then(() => {
                window.location.href = 'index.html'; // Redireciona para a página principal
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(errorMessage);
                alert('Erro ao cadastrar usuário. Verifique seus dados.');
            });
    });
});
