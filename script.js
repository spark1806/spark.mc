console.log("⚡ SPARK запущен");

fetch('worlds.json')
    .then(response => {
        if (!response.ok) throw new Error('Файл worlds.json не найден!');
        return response.json();
    })
    .then(data => {
        console.log('Загружены сезоны:', data);
        
        const container = document.querySelector('.cards');
        container.innerHTML = '';

        data.forEach(season => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const isCurrent = season.note && season.note.includes('Идёт сейчас');
            const isBroken = season.note && season.note.includes('повреждён');
            const hasSpecialNote = season.special_note && season.special_note.trim() !== '';
            const hasTwoButtons = season.nether_file && season.end_file && 
                                  season.nether_file.trim() !== '' && 
                                  season.end_file.trim() !== '';
            
            if (isCurrent) card.classList.add('current-season');
            if (isBroken) card.classList.add('broken-season');
            
            let noteHtml = '';
            if (season.note && season.note.trim() !== '') {
                let noteClass = 'note';
                if (isCurrent) noteClass = 'note current';
                if (isBroken) noteClass = 'note broken';
                noteHtml = `<p class="${noteClass}">${season.note}</p>`;
            }
            
            let specialNoteHtml = '';
            if (hasSpecialNote) {
                specialNoteHtml = `<p class="special-note">${season.special_note}</p>`;
            }
            
            let buttonHtml = '';
            if (isCurrent) {
                buttonHtml = `<p class="no-download">⏳ Сейв появится после завершения</p>`;
            } else if (isBroken) {
                buttonHtml = `<p class="no-download">🔧 Сейв недоступен</p>`;
            } else if (hasTwoButtons) {
                // ДВЕ КНОПКИ ДЛЯ SK1
                buttonHtml = `
                    <div class="button-group">
                        <a href="${season.nether_file}" target="_blank" class="download-btn nether-btn">🔥 Скачать Ад</a>
                        <a href="${season.end_file}" target="_blank" class="download-btn end-btn">🌌 Скачать Энд</a>
                    </div>
                `;
            } else {
                buttonHtml = `<a href="${season.file}" target="_blank" class="download-btn">📥 Скачать мир</a>`;
            }
            
            card.innerHTML = `
                <h3>${season.name}</h3>
                <p class="description">${season.description || ''}</p>
                ${noteHtml}
                ${specialNoteHtml}
                <div class="dates">
                    <span>📅 Начало: ${season.start || '—'}</span>
                    <span>🏁 Окончание: ${season.end || '—'}</span>
                </div>
                ${buttonHtml}
            `;
            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Ошибка:', error);
        document.querySelector('.cards').innerHTML = `
            <div class="card" style="grid-column: 1/-1; text-align: center; padding: 3rem; border: 2px solid #ff0066;">
                <h3 style="color: #ff0066;">⚠️ Не удалось загрузить сезоны</h3>
                <p>Проверь файл worlds.json</p>
                <p style="font-size: 0.8rem; color: #777; margin-top: 1rem;">Ошибка: ${error.message}</p>
            </div>
        `;
    });