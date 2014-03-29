var Lucky = Lucky || {};
void function(exports) {
	var lucky = [];
	var index = 0;

	/**
	 * 开始抽奖
	 * @param{Number} count 总人数
	 * @param{Array} [removes] 已经抽过的号，默认不排除
	 */
 	function replay(count, removes) {
 		index = 0;
 		var ranking = {}; // 权重字典
		lucky = new Array(count + 1).join().split(',').map(function(item, i) { // 获得顺序的号
			ranking[i] = Math.random(); // 随机权重
			return i;
		}).filter(function(item) { // 排除已经抽过的号
			return !(removes && removes.indexOf(item) >= 0);
		}).sort(function(a, b) { // 按权重排序
			return ranking[a] - ranking[b];
		});
	}

	function next(n) { // 获取下 n 个抽奖号码，从 0 号开始
		n = n || 1;
		var result = lucky.slice(index, index + n);
		index += n;
		return result;
	}

	exports.replay = replay;
	exports.next = next;
}(Lucky);

Lucky.replay(75);
// Lucky.replay(75, [0, 1, 2, 5, 7]); // 手工排除
// Lucky.next(); // 下 1 个号
Lucky.next(2); // 下 2 个号