# Bilgisayarında (Claude Code masaüstü) devam etmek

## 1. Zip'i aç
- `encounter-files.zip` dosyasını sağ tıklayıp **Tümünü ayıkla** de, örneğin `Belgeler\encounter-files` klasörüne çıkar.
- Not: Zip'in kendisini Claude'a seçtirmene gerek yok. Klasörü açman yeterli.

## 2. Claude Code'u o klasörde aç
- Claude masaüstü uygulamasında **Claude Code** bölümünü aç ve klasör olarak `encounter-files`'ı seç.
- Claude, klasördeki `CLAUDE.md` dosyasını **otomatik okur**: projenin ne olduğunu, kuralları ve durumu öğrenir.
- İlk mesajın şöyle olabilir:
  > CLAUDE.md ve docs/SOHBET-OZETI.md dosyalarını oku. Encounter Files projesine kaldığımız yerden devam edelim: sıradaki iş #003 iğne balığı.

## 3. Video render edebilmek için gerekenler (bir kerelik)
Claude bunları senin için kurmayı teklif edebilir. Elle yapmak istersen:
1. **Node.js** (LTS sürümü): https://nodejs.org
2. **Python 3.11+**: https://www.python.org (kurulumda "Add to PATH" kutusunu işaretle)
3. **FFmpeg**: Windows'ta `winget install ffmpeg` komutu ya da https://ffmpeg.org
4. Klasörde bir kez: `npm install` ve `pip install kokoro-onnx soundfile numpy sherpa-onnx`
5. Ses ve senkron modelleri (büyük dosyalar, git'te yok). İndirme bağlantıları `CLAUDE.md` içinde; Claude indirebilir.

## 4. Alternatif: GitHub'dan çekmek
Proje zaten burada: https://github.com/oguzzgkmn-source/encounter-files (gizli depo). Claude Code'a "bu depoyu klonla" demen de yeterli. Zip ile aynı içerik, üstüne geçmiş kayıtları da var.

## Neler zip'te yok
- Bitmiş videolar (`f2-final.mp4` vb.), çünkü çok büyükler. Onları zaten bu sohbetten indirdin.
- `node_modules` ve büyük ses/model dosyaları. Kurulumda yeniden oluşuyorlar.
