let searchLine = document.querySelector('.searchLine')
let searchBtn = document.querySelector('.iconSearch')
let container = document.querySelector('.elements')
let weatherInfo = []

if (localStorage.getItem("defaultWeatherKD")){
    container.innerHTML = localStorage.getItem("defaultWeatherKD")
}


// Ввод: Enter и по поиску
searchLine.addEventListener("keypress", function (event){
    console.log(event.key)
    if ((event.key === "Enter") && (searchLine.value.length > 0)) {
        let check = true
        let cityNames = document.querySelectorAll('.city')
        cityNames.forEach(name=>{
            if (name.innerHTML === searchLine.value){
                check = false
            }
        })
        if (check){
            searchInfo()
        }
        searchLine.value = ""
    }
})
searchBtn.addEventListener("click", function (){
    if (searchLine.value.length > 0){
        let check = true
        let cityNames = document.querySelectorAll('.city')
        cityNames.forEach(name=>{
            if (name.innerHTML === searchLine.value){
                check = false
            }
        })
        if (check){
            searchInfo()
        }
        searchLine.value = ""
    }
})

function searchInfo() {
    console.log("Запрос отправлен со значением")
    console.log(searchLine.value)
    createNewCard()
    searchLine.value = ""
}


//Запрос на Weather API
const token = "df594627cab329c8ec812d9054c52588"
const api = "https://api.openweathermap.org/data/2.5/weather?lang=ru&units=metric"
async function getWeather(city){
    console.log(city)
    const response = await fetch(`${api}&appid=${token}&q=${city}`)
    let check = await response
    console.log(check)
    if (!check.ok){
        searchLine.placeholder = 'Такого города не существует!'
        return "ER"
    } else {
        searchLine.placeholder = 'Введите город...'
        let data = await check.json()
        console.log(data)
        console.log(data.name)
        console.log(Math.floor(data.main.temp))
        console.log(Math.floor(data.main.feels_like))
        console.log(data.weather[0].main)
        console.log(Math.floor(data.main.temp_max))
        console.log(Math.floor(data.main.temp_min))
        console.log(Math.floor(data.wind.speed))
        console.log(Math.floor(data.main.pressure))
        console.log(data.main.humidity)
        setWeather(data)
        return "OK"
    }
}

//Распределение данных по массиву
function setWeather(data) {
    weatherInfo[0] = data.name
    weatherInfo[1] = Math.floor(data.main.temp)
    weatherInfo[2] = Math.floor(data.main.feels_like)
    weatherInfo[3] = data.weather[0].main
    weatherInfo[4] = Math.floor(data.main.temp_max)
    weatherInfo[5] = Math.floor(data.main.temp_min)
    weatherInfo[6] = Math.floor(data.wind.speed) + "м/с"
    weatherInfo[7] = Math.floor(data.main.pressure) + "Pa"
    weatherInfo[8] = data.main.humidity + "%"
    weatherInfo[9] = data.weather[0].icon
}

//Обновление данных "каждые" 10 секунд
setInterval(UdpInfo, 10000)
async function UdpInfo(){
    let weathers = document.querySelectorAll('.weather')
    for (weather of weathers){
        let texts = weather.querySelectorAll('.text_js')
        let iconWeather = weather.querySelector('.weatherIcon')
        const timPro = refresh(texts[0].innerHTML)
        await timPro
        let i = 0
        texts.forEach(text=>{
            text.innerHTML = weatherInfo[i]
            i++
        })
        iconWeather.setAttribute('src', `Photo/${weatherInfo[9]}.png`)
    }
    Upd()
}
async function refresh(texts){
    await getWeather(texts)
}

//Сохранение
function Upd(){
    localStorage.setItem("defaultWeatherKD", container.innerHTML)
}

//Drag and drop
let weathers = document.querySelectorAll('.weather')
let elements = document.querySelectorAll('.element')

let lastItem
let lastCell

DragDrop()

function DragDrop(){
    weathers = document.querySelectorAll('.weather')
    elements = document.querySelectorAll('.element')
    weathers.forEach(weather =>{
        weather.addEventListener("dragstart", function (){
            setTimeout( ()=>{
                this.style.display = "none"
                lastItem = this
                lastCell = this.parentElement
            }, 0)
        })

        weather.addEventListener("dragend", function (){
            weather.style.display = "block"
            Upd()
        })
    })

    elements.forEach(elem =>{
        elem.addEventListener("dragover", function (e){
            e.preventDefault()
            console.log("рядом")
        })

        elem.addEventListener("dragenter", function (e){
            elem.style.border = "1px solid black"
            lastCell.appendChild(elem.children[0])
            elem.appendChild(lastItem)
        })

        elem.addEventListener("dragleave", function (e){
            elem.style.border = "0"
            lastCell = elem
        })

        elem.addEventListener("drop", function (){
            console.log("брошен")
            elem.appendChild(lastItem)
            elem.style.border = "0"

        })
    })
}

//Создание нового элемента
async function createNewCard(){
    if (await getWeather(searchLine.value) === "OK"){
        let elements = document.querySelector('.elements')

        let element = document.createElement('div')
        element.setAttribute('class', 'element')
        elements.appendChild(element)

        let elem = document.createElement('div')
        elem.setAttribute('class', 'weather')
        elem.setAttribute('draggable', 'true')
        element.appendChild(elem)

        let elem2 = document.createElement('div')
        elem2.setAttribute('class', 'btnClose')
        elem2.setAttribute('onclick', 'this.parentElement.parentElement.remove(); Upd()')
        elem.appendChild(elem2)

        let elem3 = document.createElement('div')
        elem3.setAttribute('class', 'cityName')
        elem.appendChild(elem3)

        let elem4 = document.createElement('p')
        elem4.setAttribute('class', 'text city text_js')
        elem4.innerHTML = weatherInfo[0]
        elem3.appendChild(elem4)

        let elem5 = document.createElement('div')
        elem5.setAttribute('class', 'mainInfo')
        elem.appendChild(elem5)

        let elem6 = document.createElement('div')
        elem6.setAttribute('class', 'mainTemp')
        elem5.appendChild(elem6)

        let elem8 = document.createElement('p')
        elem8.setAttribute('class', 'text temp text_js')
        elem8.innerHTML = weatherInfo[1]
        elem6.appendChild(elem8)

        let elem9 = document.createElement('div')
        elem9.setAttribute('class', 'feelsLike')
        elem6.appendChild(elem9)

        let elem10 = document.createElement('p')
        elem10.setAttribute('class', 'text tempFeelsLike')
        elem10.innerHTML = "Ощущается как: "
        elem9.appendChild(elem10)

        let elem11 = document.createElement('p')
        elem11.setAttribute('class', 'text tempFeelsLike text_js')
        elem11.innerHTML = weatherInfo[2]
        elem9.appendChild(elem11)

        let elem7 = document.createElement('div')
        elem7.setAttribute('class', 'mainWeather')
        elem5.appendChild(elem7)

        for (let k of [
            ['img', 'weatherIcon' ,`Photo/${weatherInfo[9]}.png`],
            ['p', 'text weatherDescription text_js' ,weatherInfo[3]],
        ]){
            let elemIn = document.createElement(k[0])
            elemIn.setAttribute('class', k[1])
            if (k[0] === 'img'){
                elemIn.setAttribute('src', k[2])
                elemIn.setAttribute('alt', '')
            } else {
                elemIn.innerHTML = k[2]
            }
            elem7.appendChild(elemIn)
        }

        let elem15 = document.createElement('div')
        elem15.setAttribute('class', 'maxMinTemp')
        elem.appendChild(elem15)

        for (let k of [
            ['img', 'Photo/Tmax.png'],
            ['p', weatherInfo[4]],
            ['img', 'Photo/Tmin.png'],
            ['p', weatherInfo[5]],
        ]){
            let elemIn = document.createElement(k[0])
            if (k[0] === 'img'){
                elemIn.setAttribute('class', 'weatherIconTemp')
                elemIn.setAttribute('src', k[1])
                elemIn.setAttribute('alt', '')
            } else {
                elemIn.setAttribute('class', 'text textInfoElem text_js')
                elemIn.innerHTML = k[1]
            }

            elem15.appendChild(elemIn)
        }

        let elem20 = document.createElement('div')
        elem20.setAttribute('class', 'moreInfo')
        elem.appendChild(elem20)

        for (let k of [
            ['Photo/Speed_wind.png', weatherInfo[6]],
            ['Photo/Pressure.png', weatherInfo[7]],
            ['Photo/Humidity.png', weatherInfo[8]],
        ]){
            let elemIn = document.createElement('div')
            elemIn.setAttribute('class', 'infoElem')

            let innerElem = document.createElement('img')
            innerElem.setAttribute('class', 'weatherIconTemp')
            innerElem.setAttribute('src', k[0])
            innerElem.setAttribute('alt', '')

            let innerElem2 = document.createElement('p')
            innerElem2.setAttribute('class', 'text textInfoElem text_js')
            innerElem2.innerHTML = k[1]

            elemIn.appendChild(innerElem)
            elemIn.appendChild(innerElem2)

            elem20.appendChild(elemIn)
        }
        DragDrop()
        Upd()
    }
}