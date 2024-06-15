document.getElementById('downloadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const videoUrl = document.getElementById('videoUrl').value;
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = 'Processando...';

    try {
        const response = await fetch(`/api/download?url=${encodeURIComponent(videoUrl)}`);
        if (!response.ok) {
            throw new Error('Erro ao processar o download do vídeo');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video.mp4';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        messageDiv.textContent = 'Download concluído!';
    } catch (error) {
        messageDiv.textContent = error.message;
    }
});
