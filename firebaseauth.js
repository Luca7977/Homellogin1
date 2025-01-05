// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkv4nwN19y35USSRRYqjylvu5tGtlpBy0",
  authDomain: "logindate2025.firebaseapp.com",
  projectId: "logindate2025",
  storageBucket: "logindate2025.firebasestorage.app",
  messagingSenderId: "207880853586",
  appId: "1:207880853586:web:aa13aa25c33deb2069678b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Hàm hiển thị thông báo
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function() {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Hàm kiểm tra mật khẩu hợp lệ
function isPasswordValid(password) {
  // Mật khẩu phải có ít nhất 6 ký tự, bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số
 const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
 return regex.test(password);
}

// Đăng ký tài khoản
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  // Kiểm tra mật khẩu hợp lệ
  if (!isPasswordValid(password)) {
    showMessage('Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, kí tự đặc biệt và số.', 'signUpMessage');
    return;
  }

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName
      };
      showMessage('Tạo tài khoản thành công!', 'signUpMessage');
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error("Lỗi khi ghi tài liệu:", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == 'auth/email-already-in-use') {
        showMessage('Địa chỉ email đã được sử dụng!', 'signUpMessage');
      } else {
        showMessage('Không thể tạo tài khoản', 'signUpMessage');
      }
    });
});

// Đăng nhập
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Kiểm tra mật khẩu hợp lệ
  if (!isPasswordValid(password)) {
    showMessage('Mật khẩu không hợp lệ. Hãy kiểm tra lại.', 'signInMessage');
    return;
  }

  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('Đăng nhập thành công!', 'signInMessage');
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = 'homepage.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        showMessage('Email hoặc mật khẩu không chính xác.', 'signInMessage');
      } else {
        showMessage('Tài khoản không tồn tại.', 'signInMessage');
      }
    });
});
