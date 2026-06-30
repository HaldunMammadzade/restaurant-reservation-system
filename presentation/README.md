# Premium Təqdimat — 3D Salon + Seat View

## Başlamaq

```
/teqdimat          → Ana səhifə (WOW hero)
/teqdimat/3d       → Three.js 3D masa seçimi ★ ƏSAS
/teqdimat/explore  → Zona turları
```

## Təqdimat ssenarisi (rəhbərliyə)

### 1. Ana səhifə (`/teqdimat`)
Böyük **"3D Salon + Seat View"** düyməsinə bas.

### 2. 3D Salon (`/teqdimat/3d`) — WOW ANI
1. Salonu fırladın (sürüşdürün), yaxınlaşdırın
2. **Yaşıl parlayan masaya toxunun**
3. Kamera avtomatik **oturacağınıza uçur** (1.5 san animasiya)
4. **Panorama görünüş** açılır — pəncərə/terras/bağ
5. **Gündüz / Axşam** keçidi
6. **"Bu masanı rezerv et"**

### 3. Sinxron (laptop)
Eyni brauzerdə ikinci tab: `/floor-plan` və ya `/reservations`
Rezervasiya dərhal görünür.

## Texnologiya

- **Three.js** + React Three Fiber
- 3D masalar (hover, pulse, click)
- Kamera fly animasiya
- Curved panorama (cylinder geometry + texture)
- Ulduzlar, işıq, kölgə
- Framer Motion UI overlay

## Struktur

```
presentation/components/three/
  Restaurant3DExperience.jsx  # Əsas təcrübə
  RestaurantScene.jsx         # 3D salon
  TableMesh.jsx               # Masa + stullar
  ViewPanorama.jsx            # Seat View panorama
  CameraRig.jsx               # (RestaurantScene içində)
```

## Qeyd

İlk yükləmə ~2MB (Three.js). Lazy load aktivdir.
