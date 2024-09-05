let date = new Date();

const renderCalendar = () => {
  const viewYear = date.getFullYear();
  const viewMonth = date.getMonth();

  document.querySelector('.year-month').textContent = `${viewYear}년 ${viewMonth + 1}월`;

  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth + 1, 0);

  const PLDate = prevLast.getDate();
  const PLDay = prevLast.getDay();

  const TLDate = thisLast.getDate();
  const TLDay = thisLast.getDay();

  const prevDates = [];
  const thisDates = [...Array(TLDate + 1).keys()].slice(1);
  const nextDates = [];

  if (PLDay !== 6) {
    for (let i = 0; i < PLDay + 1; i++) {
      prevDates.unshift(PLDate - i);
    }
  }

  for (let i = 1; i < 7 - TLDay; i++) {
    nextDates.push(i);
  }

  const dates = prevDates.concat(thisDates, nextDates);

  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(TLDate);

  const datesHTML = dates.map((date, i) => {
    const condition = i >= firstDateIndex && i < lastDateIndex + 1 ? 'this' : 'other';
    
    const actualMonth = (condition === 'this') ? viewMonth : (i < firstDateIndex ? viewMonth - 1 : viewMonth + 1);
    const actualDate = new Date(viewYear, actualMonth, date);
    const daystr = actualDate.toISOString().split('T')[0];
    var newDaystr = new Date(daystr);
    newDaystr.setDate(newDaystr.getDate()+1);
    var dayYear = newDaystr.getFullYear();
    var dayMonth = ('0' + (newDaystr.getMonth() + 1)).slice(-2);
    var dayDay = ('0' + newDaystr.getDate()).slice(-2);
    var day = dayYear + '-' + dayMonth + '-' + dayDay;
    
    const dayTodos = todos.filter(todo => {
      const todoStartDay = new Date(todo.start_time).toISOString().split('T')[0];
      const todoEndDay = new Date(todo.end_time).toISOString().split('T')[0];
      return day >= todoStartDay && day <= todoEndDay;
    });

    
    const todoHTML = dayTodos.map(todo => {
      return `<li><a href="#pop_info_2" class="btn_open_detail">${todo.title}</a></li>` ;
    }).join('');
    return `
      <div class="date">
        <a href="#pop_info_1" class="${condition} date-link" data-date="${day}">${date}</a>
        <ul>${todoHTML}</ul>
      </div>
    `;
  }).join('');

  document.querySelector('.dates').innerHTML = datesHTML;

  const today = new Date();
  if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
    for (let date of document.querySelectorAll('.this')) {
      if (+date.innerText === today.getDate()) {
        date.classList.add('today');
        break;
      }
    }
  }

  // Add event listeners for date links to open the popup
  const dateLinks = document.querySelectorAll('.date-link');
  dateLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const selectedDate = this.getAttribute('data-date');
      var datestr = new Date(selectedDate);
      datestr.setDate(datestr.getDate());
      var dateYear = datestr.getFullYear();
      var dateMonth = ('0' + (datestr.getMonth() + 1)).slice(-2);
      var dateDay = ('0' + datestr.getDate()).slice(-2);
      var newDateStr = dateYear + '-' + dateMonth + '-' + dateDay;
      const startInput = document.getElementById('start_time');
      const endInput = document.getElementById('end_time');
      startInput.value = `${newDateStr}T00:00`;
      endInput.value = `${newDateStr}T23:59`;

      document.querySelector('#pop_info_1').style.display = 'block';
    });
  });

  // Add event listeners for todo detail links to open the popup
  const detailLinks = document.querySelectorAll('.btn_open_detail');
  detailLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      
      // Find the corresponding todo item based on the link clicked
      const todoTitle = this.textContent;
      const todo = todos.find(todo => todo.title === todoTitle);
  
      if (todo) {
        const startTimeUTC = new Date(todo.start_time);
        const endTimeUTC = new Date(todo.end_time);

        document.querySelector('.details').innerHTML = `
          <p id="detail_title">Title: ${todo.title}</p>
          <p id="detail_text">Memo: ${todo.text}</p>
          <p id="detail_starttime">Start Time: ${todo.start_time}</p>
          <p id="detail_endtime">End Time: ${todo.end_time}</p>
        `;
      }
  
      document.querySelector('#pop_info_2').style.display = 'block';
    });
  });

  const updateLinks = document.querySelectorAll('.update_btn');
  updateLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const todoTitle = document.querySelector('#detail_title').textContent.split(': ')[1];
      const todo = todos.find(todo => todo.title === todoTitle);
      if (todo) {
        document.getElementById('update_title').value = todo.title;
        document.getElementById('update_text').value = todo.text;
        document.getElementById('update_start_time').value = todo.start_time;
        document.getElementById('update_end_time').value = todo.end_time;

        // Set form action dynamically
        const updateForm = document.getElementById('update_form');
        updateForm.action = `/update/?title=${encodeURIComponent(todoTitle)}`;
      }

      document.querySelector('#pop_info_3').style.display = 'block';
    });
  });

  // Add event listener for closing the popups
  const closeButtons = document.querySelectorAll('.btn_close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.closest('.pop_wrap').style.display = 'none';
    });
  });
};

renderCalendar();

const prevMonth = () => {
  date.setDate(1);
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};

const nextMonth = () => {
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

const goToday = () => {
  date = new Date();
  renderCalendar();
};
