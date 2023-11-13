// פונקציה לשינוי הסדר
function print(wordToPrint) {
    console.log(wordToPrint.split('').reverse().join(''));
}


const express = require('express')
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// קביעת פורט
const port = 3000


// מערך ספרים
let BOOKS = [
    { id: 1, author: 'J.K. Rowling', title: 'Harry Potter and the Sorcerer\'s Stone' },
    { id: 2, author: 'George Orwell', title: '1984' },
    { id: 3, author: 'Harper Lee', title: 'To Kill a Mockingbird' },
    { id: 4, author: 'J.R.R. Tolkien', title: 'The Lord of the Rings' },
    { id: 5, author: 'Jane Austen', title: 'Pride and Prejudice' },
    { id: 6, author: 'F. Scott Fitzgerald', title: 'The Great Gatsby' },
    { id: 7, author: 'Ernest Hemingway', title: 'The Old Man and the Sea' },
    { id: 8, author: 'Agatha Christie', title: 'Murder on the Orient Express' },
    { id: 9, author: 'Gabriel Garcia Marquez', title: 'One Hundred Years of Solitude' },
    { id: 10, author: 'Dan Brown', title: 'The Da Vinci Code' },
    { id: 11, author: 'Mark Twain', title: 'The Adventures of Tom Sawyer' },
    { id: 12, author: 'Fyodor Dostoevsky', title: 'Crime and Punishment' },
    { id: 13, author: 'Charlotte Brontë', title: 'Jane Eyre' },
    { id: 14, author: 'Ray Bradbury', title: 'Fahrenheit 451' },
    { id: 15, author: 'William Golding', title: 'Lord of the Flies' }
];

// קבל את כל הספרים השמורים במערכת
app.get("/books", (req, res) => {
    let limit = parseInt(req.query.limit, 10) || 10
    let offset = parseInt(req.query.offset, 10) || 0
    let limitbooks = BOOKS.slice(offset, offset + limit)
    print("כל הספרים ")
    console.log(BOOKS);
    res.send(limitbooks)
})

// קבל ספר ספציפי לפי ID
app.get("/books/:bookId", (req, res) => {
    let id = req.params.bookId
    let book = BOOKS.find((book) => book.id == id)
    if (book) {
        print("קבלת ספר יחיד")
        console.log(book);
        res.send(book)
    } else {
        print("ספר לא קיים")
        res.status(404)
        res.send({ msg: "ספר לא קיים" })
    }
})


// צור ספר חדש
app.post("/book", (req, res) => {
    let book = req.body;
    BOOKS.push(book)
    res.status(201)
    print("ספר הוכנס בהצלחה")
    console.log({ book });
    res.send({ "msg": "ספר הוכנס בהצלחה", book })
})

// בדוק אם קיים ספר אז עדכן אותו אחרת צור ספר חדש
app.put("/books/:bookId", (req, res) => {
    const id = req.params.bookId;
    const book = BOOKS.find((book) => book.id == id);

    if (book) {
        const updatedBook = req.body;

        // בדיקות תקינות נוספות כגון האם יש את כל המידע שנדרש
        if (updatedBook && updatedBook.author && updatedBook.title) {
            BOOKS = BOOKS.map((book) => {
                if (book.id == id) {
                    return updatedBook;
                }
                return book;
            });
            print("ספר עודכן בהצלחה")
            console.log({ updatedBook });

            res.send({ "msg": "הספר עודכן בהצלחה", updatedBook });
        } else {
            print("קלט לא תקין")
            res.status(400)
            res.send({ "msg": "קלט לא תקין" });
        }
    } else {
        const newBook = req.body;
        if (newBook && newBook.author && newBook.title) {
            BOOKS.push(newBook);
            res.status(201)
            print("ספר נוצר בהצלחה")
            console.log({ newBook });
            res.send({ "msg": "הספר נוצר בהצלחה", newBook });
        } else {
            res.status(400).send({ "msg": "קלט לא תקין" });
        }
    }
});


app.patch("/books/:bookId", (req, res) => {
    const id = req.params.bookId;
    const book = BOOKS.find((book) => book.id == id);

    if (book) {
        const updatedFields = req.body;

        // בדיקת תקינות של הנתונים שנשלחו
        if (Object.keys(updatedFields).length > 0) {
            BOOKS[book] = { ...BOOKS[book], ...updatedFields };

            print("ספר עודכן בהצלחה ")
            console.log({ updatedFields });

            res.send({ "msg": "הספר עודכן בהצלחה", updatedFields });
        } else {
            print("אין שדות לעדכון")
            res.status(400)
            res.send({ "msg": "אין שדות לעדכון" });
        }
    } else {
        print("הספר לא נמצא")
        res.status(404)
        res.send({ "msg": "הספר לא נמצא" });
    }
});


// מחק ספר
app.delete("/books/:bookId", (req, res) => {
    const id = req.params.bookId;
    let book = BOOKS.find((book) => book.id == id)
    if (book) {
        const deletedBook = BOOKS.splice(id-1, 1);
        print("ספר נמחק בהצלחה")
        console.log({ deletedBook });
        res.send({ "msg": "הספר נמחק בהצלחה", deletedBook });
    } else {
        print("הספר לא נמצא")
        res.status(404)
        res.send({ "msg": "הספר לא נמצא" });
    }
})

// הפעלת השרת
app.listen(port, () => {
    print("שרת הופעל בהצלחה, הכתובת היא")
    console.log(`http://localhost:${port}`)
})

