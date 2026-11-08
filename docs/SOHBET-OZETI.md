# Sohbet özeti — Encounter Files projesi (Kasım 2026)

Bu dosya, bulutta yapılan ilk Claude Code sohbetinin ayrıntılı özetidir. Yeni bir Claude oturumu bunu okuyup kaldığımız yerden devam edebilir.

---

## 1. Başlangıç: rakip kanal analizi
- Kullanıcı bir animasyon kanalı örneği verdi: **Depth Theory** (@depththeoryofficial, Kanada). 4 video vardı: Sperm Whale videosu 4 günde **2,5M** izlenme almıştı. Kanal Nisan 2026'da açılmış, ilk video 26 Ekim'de yüklenmişti.
- **Neden tuttu:** siyah-beyaz gravür tarzı thumbnail + kırmızı yazı + minik dalgıç; "you" diye hitap eden başlıklar; ucuz ama etkili motion graphics (düz vektör, lacivert zemin, etiketler, bilgi grafikleri).
- **Senaryo yapısı** (transkriptten): kural → ihlal açılışı · ortada cevaplanan açık soru · her ~60 sn'de soru ile geçiş · gündelik kıyaslar · kuru espriler · "ne yapardın" bölümü · ters köşe (asıl tehlike biziz) · açılışa geri dönüş. Ayrıntılar: `docs/rakip-analizi.md`.
- **Video kaydı analizi** (kullanıcının 38 saniyelik ekran kaydı): kesme sıklığı ~4–5 sn, ama çekim içinde hiçbir şey durmuyor (sürekli kamera hareketi, karakter animasyonu, parça parça açılan etiketler, ışığın anlatım aracı olarak kullanılması, kısa gerçek görüntüler, siyah ekran duraklamaları).
- **Uyarı:** "Why You'd Never Want To Meet A ___" başlık kalıbı birkaç gün içinde onlarca kopyacı kanalla doldu (hepsi 0–300 izlenme).

## 2. Konsept kararları
- **İngilizce**, yüz göstermeyen kanal. Çalışma adı: **Encounter Files**.
- Her video = bir hayvan + gerçek bir insan karşılaşması. Görsel kimlik: sonar/HUD (dalgıç bilgisayarı) + resimli sualtı dünyası + dalgıç karakteri ("sen").
- "YOUR MOVE" bölümü formatın imzası.
- Stok görüntü: "ara sıra, sadece kanıt anlarında" kararı alındı; şimdiye kadar hiç kullanılmadı (her şey özgün animasyon).
- Üretim: **Remotion (React ile kodla video)**. Ses: kullanıcı ElevenLabs kullanmıyor.
  - #001'de: **Kokoro** açık kaynak TTS, ses **am_michael** (kullanıcı 5 örnek arasından seçti).
  - #002'de: kullanıcı kendi aracıyla (**ai33 pro**) seslendirdi ve dosyayı gönderdi.

## 3. Encounter File #001 — Humboldt kalamarı ("Diablo rojo")
- Senaryo: `docs/pilot-senaryo.md` (kaynaklı). Süre 9:27, 123 çekim, ~4,7 sn/çekim.
- Sahneler: sonar açılış, olay dosyası, Pasifik haritası, derinlik kesiti, jet itiş, dişli vantuz, gaga, renk hücreleri (chromatophore), kamera takılı kalamar, Scott Cassell anlatımları, 2009 San Diego akını, YOUR MOVE, yamyamlık, Alaska'ya yayılım, Peru avı, kalamar tabağı.
- Thumbnail: kullanıcı ChatGPT ile 3 kapak üretti ("THEY'RE ALL AROUND YOU", "THE RED DEVIL", "WORSE THAN SHARKS?"). A/B testi önerildi. YouTube paketi: `docs/youtube-paketi.md`.
- **Yükleme sonucu:** Video kullanıcının mevcut **"Deutsche Baumaschinen"** kanalına (Almanca iş makinesi kanalı, 65 abone) yüklendi; 1 günde ~150 izlenme aldı. Kopya başlık kalıbı kullanılmış, kategori "People & Blogs", altyazı yüklenmemişti.
  - Teşhis: kanal kitlesi uyumsuz (en büyük sorun). Önerilen: Encounter Files için ayrı kanal. Kullanıcı "boşver, konumuza dönelim" dedi.
- Aynı gün 4–5 başka kanal da Humboldt kalamarı videosu yükledi. Kullanıcı "herkese verdiğin konuları istemiyorum" dedi.
  - Açıklama: Claude konuşmaları paylaşmaz, ama aynı yapay zekâ ve veri araçlarını kullanan çok kişi aynı mantıkla aynı konuya varıyor.

## 4. Yeni konu seçme yöntemi (kullanıcının talebi üzerine)
- Hayvan değil **olay** seç. Kopyacı listelerinden uzak dur. Viral kısa klibi olan ama uzun anlatımı olmayan konuları ara.
- Senaryodan önce ve yüklemeden önce son 7 günü kontrol et. Kalıp başlık kullanma. Hızlı üret.
- Elenenler: leopar foku (kopyacılarda var), titan tetik balığı (2 hafta önce aynı başlıkla yapılmış).
- Seçilen: **kılıç balığı ve marlin** (#002). Yedek: **iğne balığı** (#003).

## 5. Encounter File #002 — "THE SWORD" (kılıç balığı ve marlin)
- Senaryo: `docs/file002-senaryo.md` (kaynaklı).
  - Açılış: 1967 Alvin denizaltısı.
  - Kılıç balığının göz ısıtıcısı.
  - "Saatte 110 km" miti (Svendsen 2016: ~30 km/s, kavitasyon sınırı).
  - Yelken balığının gagayı savurması (Domenici 2014).
  - Gerçek olaylar: 1832 Farquharson kalası; 2012 tekneye atlayan marlin; 2015 Russell Ching; 2015 Randy Llanes (ölüm); 2024 Giulia Manfrini (yetkililer kılıç balığı, otel iğne balığı dedi).
  - YOUR MOVE.
  - Ters köşe: Kuzey Atlantik kılıç balığı 2009'da toparlandı.
  - Kapanış: mürettebat balığı yedi.
- 30 saniyelik test videosu onaylandı (denizaltı, çarpışma, başlık).
- Kullanıcı sesi ai33 pro ile üretti (8:44). Eşleştirme önce sessizlik tabanlıydı → kullanıcı "yazılar sesle ileri geri" dedi.
  - Kontrolde 2–6 sn kayma çıktı.
  - Yerel ASR (sherpa-onnx gigaspeech zipformer) ile kelime düzeyinde yeniden hizalandı (%98 eşleşme). **Sonraki videolarda her zaman ASR ile hizala.**
- Kullanıcı ilk 30–40 sn'de efektlerin sesini bastırdığını söyledi. Düzeltmeler:
  - Alarm bipleri kaldırıldı.
  - Açılış katmanları kısıldı.
  - Efektler de konuşma altında otomatik kısılıyor.
  - "Then something does." sonrasına 0,9 sn sessizlik eklendi (çarpışma o boşlukta).
  - Ölçüm: konuşulan yerlerde ses, efektlerin ortalama ~25 dB üstünde.
- Son hali: 8:45, 119 çekim, -14 LUFS, donmuş/siyah kare yok.
  - Paket: `docs/youtube-paketi-002.md` (3 başlık; önerilen "A Swordfish Attacked a Submarine. The Submarine Retreated.")
  - Altyazı: `docs/encounter-file-002.en.srt`

## 6. Kullanıcı tercihleri (önemli)
- Türkçe, sade ve adım adım konuşulmalı. Teknik ayrıntı istemiyor, net durum ve süre istiyor ("ne kadar kaldı?").
- "Kusursuz" sonuç bekliyor. Teslimden önce mutlaka kalite kontrolü yap: kare kontrolü, taşan yazılar, senkron, ses dengesi, donmuş kare taraması.
- Sesin her zaman net ve önde olmasını istiyor.
- Konuların başkalarıyla aynı olmasını istemiyor.
- Kapakları kendisi ChatGPT ile yapıyor; Claude prompt veriyor.

## 7. Sıradaki işler
1. **#003 iğne balığı (needlefish):** gece ışıklarına sıçrayan balık; Mentawai 2024 bağlantısı; Hawaii ve Filipinler vakaları. Önce son 7 günü kontrol et, sonra kaynaklı senaryo yaz ve onaya sun.
2. Kullanıcı başka bir sohbette yapılmış "İtalyanca video"dan bahsetti. Dosyaları burada yok. Gerekirse kullanıcıdan iste.
3. İsteğe bağlı: ayrı Encounter Files kanalı (kullanıcı şimdilik istemedi), lisanslı müzik.
