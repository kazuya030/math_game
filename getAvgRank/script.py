# coding: utf8

def match(N):
    """
    GSアルゴリズムのマッチ結果の男女の各満足度を返す

    :param N: 男女の各参加者数
    :return: (男性の平均志望度、女性の平均志望度)
    """

    import random

    # 好みの順位作成。最初にひな形を用意
    pref_m = [range(N) for _ in range(N)]
    pref_f = [range(N) for _ in range(N)]
    # 好みをランダムに生成
    map(random.shuffle, pref_m)
    map(random.shuffle, pref_f)

    # 好みの序列
    # print pref_m
    # print pref_f

    # ふられた男＝次にアタックする男の集合。最初は全員
    rejected_male = set(range(N))
    # 現在、第何志望まで来たかの配列。最初は全員第一志望。
    rank_m = [0]*N

    # アタック中の男の集合。最初は全員空
    set_applying = [ set() for _ in range(N)]

    # ふられた男がいなくなるまで以下の手順を繰り返す
    while len(rejected_male) > 0:
        # rejected_male 中の男がアタック
        [set_applying[ pref_m[_i_m][rank_m[_i_m]] ].add(_i_m) for _i_m in rejected_male]

        # 次にアタックする＝ふられる男集合を空にする
        rejected_male = set()

        # 女が選定
        for i_f, appyling in enumerate(set_applying):
            # 複数人にアタックされている女が選別
            if len(appyling) > 1:
                rank_appyling = [ pref_f[i_f].index(_) for _ in appyling]
                # ランキング1位の男を選ぶ
                i_m_winner = pref_f[i_f][min(rank_appyling)]

                # ランキング1位の男以外を rejected_male リストへ
                appyling.remove(i_m_winner)
                rejected_male |= appyling

                # ランキング1位の男だけを set_appyling に残す
                set_applying[i_f] = {i_m_winner}
        # ふられた男は志望女性のランクを下げる
        for i_m in rejected_male:
            rank_m[i_m] += 1

    # マッチ結果
    # print set_applying

    # 男の平均志望度
    avg_rank_m =  sum(rank_m) / float(N)
    # 女の最終志望度を計算（ _pair[0] が女のindex、_pair[1] は選ばれた男の index の集合）
    rank_f = [ pref_f[_pair[0]].index(_pair[1].pop()) for _pair in enumerate(set_applying)]
    # 女の平均志望度
    avg_rank_f =  sum(rank_f) / float(N)

    # 男女の平均志望度を返す
    return avg_rank_m, avg_rank_f

def plot():
    l_N = [5, 10, 20, 50, 100, 200, 500, 1000, 2000]*5
    avg = [match(_N) for _N in l_N]

    import matplotlib.pyplot as plt
    plt.xscale('log')
    plt.yscale('log')
    plt.plot(l_N, avg, 'o')

    plt.show()

if __name__ == '__main__':
    match(10)
    exit()