(() => {
  const byId = (id) => document.getElementById(id);
  const fields = ['hours', 'minutes', 'seconds', 'hundredths'].map(byId);
  const toggle = byId('toggle');
  const reset = byId('reset');
  let running = false;
  let elapsed = 0;
  let startedAt = 0;
  let frame = null;
  const current = () => elapsed + (running ? Date.now() - startedAt : 0);
  function render() {
    const ticks = Math.floor(Math.max(0, current()) / 10);
    const values = [Math.floor(ticks / 360000), Math.floor(ticks / 6000) % 60, Math.floor(ticks / 100) % 60, ticks % 100].map(n => String(n).padStart(2, '0'));
    fields.forEach((field, i) => { field.textContent = values[i]; });
    byId('timer').setAttribute('aria-label', `${values[0]}時間${values[1]}分${values[2]}秒${values[3]}`);
  }
  function tick() { render(); if (running) frame = requestAnimationFrame(tick); }
  function updateControls() {
    byId('toggle-label').textContent = running ? '停止' : elapsed > 0 ? '再開' : '開始';
    byId('toggle-icon').textContent = running ? 'Ⅱ' : '▶';
    byId('status-text').textContent = running ? '計測中' : elapsed > 0 ? '一時停止' : '準備完了';
    byId('status').classList.toggle('running', running);
    reset.disabled = running || elapsed === 0;
    reset.title = running ? '停止してからリセットできます' : '';
  }
  function toggleRunning() {
    if (running) { elapsed = current(); running = false; cancelAnimationFrame(frame); render(); }
    else { startedAt = Date.now(); running = true; tick(); }
    updateControls();
  }
  function resetTimer() {
    if (running) return;
    elapsed = 0;
    render();
    updateControls();
  }
  toggle.addEventListener('click', toggleRunning);
  reset.addEventListener('click', resetTimer);
  document.addEventListener('keydown', (event) => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.code === 'Space') {
      if (event.target.closest('button, a')) return;
      event.preventDefault();
      toggleRunning();
    } else if (event.key.toLowerCase() === 'r') { event.preventDefault(); resetTimer(); }
  });
  document.addEventListener('visibilitychange', render);
  render();
})();
