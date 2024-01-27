import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader, CircleF, InfoWindowF } from '@react-google-maps/api';
import commaNumber from 'comma-number';
import * as turf from "@turf/turf";
import Sheet from 'react-modal-sheet';
import { Button } from 'flowbite-react';
import { useGeolocated } from "react-geolocated";

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const Map = ({ dst }) => {
    const {
        coords,
        isGeolocationAvailable,
        isGeolocationEnabled
    } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true
        },
        watchPosition: true,
        userDecisionTimeout: 5000
    });

    const [src, setSrc] = useState({ lat: 0, lng: 0 });
    const [map, setMap] = useState(null);
    const [isOpen, setOpen] = useState(true);
    const [target, setTarget] = useState(null);
    const [heading, setHeading] = useState(0);
    const [arrowRotation, setArrowRotation] = useState(45);

    // Function to calculate the initial bearing between two points on Earth
    const calculateInitialBearing = (pointA, pointB) => {
        const from = turf.point([pointA.lng, pointA.lat]);
        const to = turf.point([pointB.lng, pointB.lat]);
        const options = { units: "degrees" };
        return turf.bearing(from, to, options);
    };

    const locationHandler = useCallback((coordinates) => {
        const { latitude, longitude } = coordinates;
        setSrc({ lat: latitude, lng: longitude });
    }, []);

    useEffect(() => {
        if (!isGeolocationAvailable) {
            return;
        }
        if (!isGeolocationEnabled) {
            return;
        }
        if (coords) {
            locationHandler(coords);
        }
    }, [coords, isGeolocationAvailable, isGeolocationEnabled, locationHandler]);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY
    });

    const onLoad = useCallback((map) => {
        const bounds = new window.google.maps.LatLngBounds(src);
        map.fitBounds(bounds);
        map.setOptions({
            streetViewControl: false,
            tilt: 0,
            rotateControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
            fullscreenControl: false,
        });
        setMap(map);
    }, [src]);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const onTargetLoad = useCallback((target) => {
        setTarget(target);
    }, []);

    const onTargetUnmount = useCallback(() => {
        setTarget(null);
    }, []);

    useEffect(() => {
        if (!isLoaded || !map || !src || !dst) {
            return;
        }

        const initialBearing = calculateInitialBearing(src, dst);
        setArrowRotation(initialBearing);
    }, [isLoaded, map, src, dst]);

    if (isGeolocationAvailable && !isGeolocationEnabled) {
        return (
            <main className="w-100 h-100">
                <h1>Geolocation is not enabled, Please allow the location check your setting</h1>
            </main>
        );
    }

    if (!isGeolocationAvailable) {
        return (
            <main className="w-100 h-100">
                <h1>Your browser does not support Geolocation</h1>
            </main>
        );
    }

    return isLoaded ? (
        <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={src}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onHeadingChanged={() => {
                    if (map) {
                        const newHeading = map.getHeading();
                        setHeading(newHeading);
                    }
                }}
            >
                {/* ... (your existing map components) */}
            </GoogleMap>

            <Button
                style={{
                    position: "absolute",
                    bottom: "2rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: "9999",
                    width: "100%",
                    maxWidth: "40rem",
                }}
                onClick={() => setOpen(true)}
            >
                View Distance
            </Button>

            <Sheet
                isOpen={isOpen}
                snapPoints={[0.4, 0.2]}
                initialSnap={1}
                onClose={() => setOpen(false)}
            >
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content
                        style={{
                            paddingX: "2rem",
                        }}
                    >
                        <div
                            width="100%"
                            height="100%"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                }}
                            >
                                {commaNumber(turf.distance(
                                    [src.lng, src.lat],
                                    [dst.lng, dst.lat],
                                    { units: "meters" }
                                ).toFixed(2))}{" "}
                                meters
                            </h1>
                            <span
                                style={{
                                    fontSize: "1.2rem",
                                    textAlign: "center",
                                }}
                            >
                                If you walk at a speed of 1.4 m/s, it will take you{" "}
                                {commaNumber((turf.distance(
                                    [src.lng, src.lat],
                                    [dst.lng, dst.lat],
                                    { units: "meters" }
                                ) / 1.4).toFixed(2))}{" "}
                                seconds to reach your destination!
                            </span>
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
        </>
    ) : <></>;
};

export default React.memo(Map);