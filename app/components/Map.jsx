import React from 'react'
import { GoogleMap, Marker, Polyline, useJsApiLoader, CircleF, InfoWindowF } from '@react-google-maps/api';
import commaNumber from 'comma-number';
import * as turf from "@turf/turf";
import Sheet from 'react-modal-sheet';
import { Button } from 'flowbite-react';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

function Map({ src, dst }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY
    })

    const [map, setMap] = React.useState(null)
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(src);
        map.fitBounds(bounds);
        map.setOptions({
            streetViewControl: false,
            tilt: 0,
            rotateControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
            fullscreenControl: false,
        })

        setMap(map)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    const [isOpen, setOpen] = React.useState(true);

    const [target, setTarget] = React.useState(null)

    const onTargetLoad = React.useCallback(function callback(target) {
        setTarget(target)
    }, [])
    const onTargetUnmount = React.useCallback(function callback(target) {
        setTarget(null)
    }, [])

    const [heading, setHeading] = React.useState(0);

    // Function to calculate the initial bearing between two points on Earth
    const calculateInitialBearing = (pointA, pointB) => {
        const from = turf.point([pointA.lng, pointA.lat]);
        const to = turf.point([pointB.lng, pointB.lat]);

        const options = { units: "degrees" };

        return turf.bearing(from, to, options);
    }

    const [arrowRotation, setArrowRotation] = React.useState(45);

    React.useEffect(() => {
        if (!map) return;
        if (!src || !dst) return;

        const initialBearing = calculateInitialBearing(
            src,
            dst
        );
        setArrowRotation(initialBearing);
    }, [
        src,
        dst,
        map
    ]);

    return isLoaded ? (
        <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                    lat: 7.076674, // Initial position (same as target for demonstration)
                    lng: 125.597120,
                }}
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


                <CircleF options={{
                    center: dst,
                    radius: 5,
                    strokeColor: "red",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "red",
                    fillOpacity: 0.1,
                    clickable: false,
                    draggable: false,
                    editable: false,
                    visible: true,
                }} />
                { /* Child components, such as markers, info windows, etc. */}
                <Marker
                    onLoad={onTargetLoad}
                    onUnmount={onTargetUnmount}
                    position={dst}
                />

                {/* Person Marker */}
                {/* Dynamic Arrow (You may need to style this) }
                <div
                    className="arrow"
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) rotate(${arrowRotation}deg)`,
                        left: "50%",
                        top: "50%",
                        width: "0",
                        height: "0",
                        borderLeft: "10px solid transparent",
                        borderRight: "10px solid transparent",
                        borderBottom: "20px solid red", // Adjust the color and size as needed
                    }}
                ></div>
                {*/}

                {/* Dotted line*/}
                <Polyline
                    path={
                        [
                            src,
                            dst,
                        ]
                    }
                    options={{
                        strokeColor: "black",
                        strokeOpacity: 0.5,
                        strokeWeight: 2,
                        icons: [
                            {
                                icon: {
                                    path: "M 0,-1 0,1",
                                    strokeOpacity: 1,
                                    scale: 4,
                                },
                                offset: "0",
                                repeat: "20px",
                            },
                        ],
                    }}
                />

                <CircleF options={{
                    center: src,
                    radius: 0.5,
                    strokeColor: "blue",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: "blue",
                    fillOpacity: 0.7,
                    clickable: false,
                    draggable: false,
                    editable: false,
                    visible: true,
                }}>
                    
                </CircleF>

                <InfoWindowF
                    position={src}
                >
                    <div>
                        <h1>This is you!</h1>
                    </div>
                </InfoWindowF>
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
    ) : <></>
}

export default React.memo(Map)
