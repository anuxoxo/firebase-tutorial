const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

function renderCafe(doc) {
    let li = document.createElement("li");
    let name = document.createElement("span");
    let city = document.createElement("span");
    let cross = document.createElement("div");

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // deletion
    cross.addEventListener('click', (e) => {
        e.stopPropagation();

        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    })
}

// getting data where
// db.collection('cafes').where('city', '==', 'Delhi').get().then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//         renderCafe(doc);
//     })
// })

// getting data orderBy
// db.collection('cafes').orderBy('name').get().then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//         renderCafe(doc);
//     })
// })

// REALTIME LISTENER
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {

    let changes = snapshot.docChanges();

    changes.forEach((change) => {
        if (change.type == 'added') {
            renderCafe(change.doc);
        } else if (change.type == 'removed') {
            let li = document.querySelector("[data-id=" + change.doc.id + "]");
            cafeList.removeChild(li);
        }
    })
})


// getting data
// db.collection('cafes').get().then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//         renderCafe(doc);
//     })
// })

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (form.name.value && form.city.value) {
        db.collection('cafes').add({
            name: form.name.value,
            city: form.city.value
        })

        form.name.value = '';
        form.city.value = '';

    } else {
        alert("Please enter something!");
    }
})

// // update vs set
// db.collection('cafes').doc('id').update({ name: 'yeee' }); // update in existing
// db.collection('cafes').doc('id').set({ name: 'yeee' }); // resets everything