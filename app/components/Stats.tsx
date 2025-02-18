export default function Stats() {
    return (
        <div className="grid grid-cols-3 gap-4 mt-8 text-[#8d8e98]">
            <div>
                <div className="text-4xl text-white mb-2">2</div>
                <div>อุปกรณ์ที่พบ</div>
            </div>
            <div>
                <div className="text-4xl text-white mb-2">2</div>
                <div>ช่องโหว่ที่ตรวจพบ</div>
            </div>
            <div>
                <div className="text-4xl text-white mb-2">สูง</div>
                <div>ระดับความเสี่ยง</div>
            </div>
        </div>
    );
} 