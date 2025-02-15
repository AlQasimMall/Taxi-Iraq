// nearby-drivers-map.js
class NearbyDriversMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userLocation: null,
            drivers: [],
            loading: true
        };
    }

    componentDidMount() {
        // الحصول على موقع المستخدم
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    userLocation: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    loading: false
                });
            },
            (error) => {
                console.error('Error getting location:', error);
                this.setState({ loading: false });
            }
        );

        // مراقبة السائقين القريبين
        const driversRef = firebase.database().ref('drivers');
        driversRef.on('value', (snapshot) => {
            const driversData = [];
            snapshot.forEach((child) => {
                if (child.val().coordinates) {
                    driversData.push({
                        id: child.key,
                        ...child.val()
                    });
                }
            });
            this.setState({ drivers: driversData });
        });
    }

    componentWillUnmount() {
        // إيقاف المراقبة عند إغلاق الخريطة
        firebase.database().ref('drivers').off();
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="loading-map">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>جاري تحميل الخريطة...</p>
                </div>
            );
        }

        return (
            <div id="map" style={{ height: '70vh', width: '100%' }}></div>
        );
    }
}