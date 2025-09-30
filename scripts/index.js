import * as server from '@minecraft/server';
import * as ui from '@minecraft/server-ui';

/*functionまとめ
- selection(player): プレイヤーにキャラクターを選択させる
- selection2(player): プレイヤーにアクションを選択させる
- selection3(player): プレイヤーにゲームモードを選択させる
- egui(player): プレイヤーに同盟を結ぶかどうかを選択させる(ビスマルク用)
- first_option(): キャラクターの初期設定を行う
- get_score(score_name, player_name): プレイヤーの特定のスコアを取得する

- onmitsu(player, power): プレイヤーに透明化効果を付与する,隠密
- ninshikisogai(player, power): プレイヤーに断続的な透明化効果を付与する,認識阻害
- hakai(target, power, antipower): プレイヤーに弱体化効果を付与する,破壊
- donka(target, power, antipower): プレイヤーに鈍化効果を付与する,鈍化
- kyohu(target, power, antipower): プレイヤーに盲目と飢餓効果を付与する,恐怖

- kouhun(player, count): プレイヤーの戦意と殺意を増加させる
- get_score(score_name, player_name): プレイヤーの特定のスコアを取得する
- momimomisurunohayokunaitteittenndayo(): 同盟の持続時間を管理する(ビスマルク用)
- circle_particle(player, range, particleName): プレイヤーの周囲に円形のパーティクルを表示する
- near_man(source, range): プレイヤーの近くにいる他のプレイヤー(source)を取得する
*/

//cooltime集:cooltime_1, cooltime_2, cooltime_3, cooltime_4, cooltime_5, cooltime_6, cooltime_7, cooltime_8までで

const greatFigures = {
  科技: [
    'アイザック・ニュートン',
    'アルベルト・アインシュタイン',
    'ガリレオ・ガリレイ',
    'ジョン・フォン・ノイマン',
    'ニコラ・テスラ',
    'マリー・キュリー',
    'ルイ・パスツール',
    'トーマス・エジソン',
    'チャールズ・ダーウィン',
    'ジェームズ・ワット',
    'スティーブン・ホーキング',
    'ヒポクラテス',
    'ピタゴラス',
    'アルキメデス',
    'レオンハルト・オイラー',
    'カール・フリードリヒ・ガウス',
    'ピエール・ド・フェルマー',
    'アルフレッド・ノーベル',
    '北里柴三郎',
    'ヘンリー・フォード',
    'エルヴィン・シュレーディンガー',
    'ロバート・オッペンハイマー',
    'ドミトリ・メンデレーエフ',
    'ヨハネス・ケプラー',
    '南部陽一郎',
    'ニールス・ボーア',
    'リチャード・ファインマン',
    'アラン・チューリング',
    'マックス・プランク',
    'ピエール=シモン・ラプラス',
    'アレキサンダー・フレミング',
    '湯川秀樹',
  ],
  芸文: [
    'パブロ・ピカソ',
    'ルートヴィヒ・ベートーヴェン',
    '太宰治',
    'フィンセント・ファン・ゴッホ',
    '葛飾北斎',
    'ドストエフスキー',
    'ウィリアム・シェイクスピア',
    '夏目漱石',
    '宮沢賢治',
    'ヨハン・バッハ',
    'ヴォルフガング・モーツァルト',
    'コナン・ドイル',
    'ミケランジェロ',
    'サルバドール・ダリ',
    'クロード・モネ',
    '松尾芭蕉',
    '谷崎潤一郎',
    'アーネスト・ヘミングウェイ',
    'エドガー・アラン・ポー',
    'フランツ・カフカ',
    'チャールズ・チャップリン',
    'エドワード・ゴーリー',
    '千利休',
    'マイケル・ジャクソン',
    '手塚治虫',
    'ヨハン・ゲーテ',
  ],
  軍政: [
    '宮本武蔵',
    '上杉謙信',
    'アレクサンドロス',
    'ナポレオン・ボナパルト',
    '織田信長',
    '呂布',
    '関羽',
    'オットー・フォン・ビスマルク',
    'アウグストゥス',
    'アーサー王',
    '那須与一',
    '弁慶',
    'シモ・ヘイヘ',
    'ジャンヌ・ダルク',
    'チンギス・ハン',
    'アドルフ・ヒトラー',
    'ヨシフ・スターリン',
    '毛沢東',
    'ポル・ポト',
    'ハンムラビ王',
    '坂本竜馬',
    '聖徳太子',
    '服部半蔵',
  ],
  思宗: [
    'イエス・キリスト',
    '釈迦',
    'ムハンマド',
    'ソクラテス',
    'ロック/ルソー/モンテスキュー',
    'ノストラダムス',
    'プラトン',
    '孔子',
    'フリードリヒ・ニーチェ',
    'フィリッパ・フット',
    '福沢諭吉',
    'ルートヴィヒ・ヴィトゲンシュタイン',
    'イマヌエル・カント',
    'ルネ・デカルト',
    'アリストテレス',
    'マルティン・ルター',
  ],
  反非: [
    // 犯罪者・アウトロー・その他
    'ジャック・ザ・リッパー',
    'ビリー・ザ・キッド',
    'ジェフリー・ダーマー',
    'ゾディアック',
    'ボニー＆クライド',
    '石川五右衛門',
  ],
  多属: ['レオナルド・ダ・ヴィンチ'],
  探究: [
    // 元の「柘求」と「科技」から探求・探検関連を抽出
    'ユーリィ・ガガーリン',
    'クリストファー・コロンブス',
    'フェルディナンド・マゼラン',
    'ヴァスコ・ダ・ガマ',
    'ニール・アームストロング',
    '伊能忠敬',
    'ライト兄弟',
    'コペルニクス',
    'エドウィン・ハッブル',
    'ジャン・アンリ・ファーブル',
  ],
  その他: [
    // 慈善家・人権活動家
    'マザー・テレサ',
    'マハトマ・ガンジー',
    'フローレンス・ナイチンゲール',
    'ネルソン・マンデラ',
    'キング牧師',
    'アブラハム・リンカーン',
    'アンリ・デュナン',
    '渋沢栄一',
    'ウォルト・ディズニー',
    'クレオパトラ',
  ],
};

function cooltime(number, player, sec) {
  player.runCommandAsync(`scoreboard players set @s cooltime_${number} ${sec}`);
}

function sel_kagi(player) {
  const form = new ui.ActionFormData();
  for (const a of greatFigures.科技) {
    form.button(`${a}`);
  }
  form.show(player).then((response) => {
    if (response.canceled) {
      selection(player);
    } else {
      const selectedIndex = response.selection;
      const selTag = greatFigures.科技[selectedIndex];
      player.addTag(`${selTag}`);
      player.runCommandAsync(
        `tellraw @s {"rawtext":[{"text":"${selTag}を選択しました"}]}`
      );
    }
  });
}
function sel_geibun(player) {
  const form = new ui.ActionFormData();
  for (const a of greatFigures.芸文) {
    form.button(`${a}`);
  }
  form.show(player).then((response) => {
    if (response.canceled) {
      selection(player);
    } else {
      const selectedIndex = response.selection;
      const selTag = greatFigures.芸文[selectedIndex];
      player.addTag(`${selTag}`);
      player.runCommandAsync(
        `tellraw @s {"rawtext":[{"text":"${selTag}を選択しました"}]}`
      );
    }
  });
}
function sel_gunsei(player) {
  const form = new ui.ActionFormData();
  for (const a of greatFigures.軍政) {
    form.button(`${a}`);
  }
  form.show(player).then((response) => {
    if (response.canceled) {
      selection(player);
    } else {
      const selectedIndex = response.selection;
      const selTag = greatFigures.軍政[selectedIndex];
      player.addTag(`${selTag}`);
      player.runCommandAsync(
        `tellraw @s {"rawtext":[{"text":"${selTag}を選択しました"}]}`
      );
    }
  });
}
function sel_sishu(player) {
  const form = new ui.ActionFormData();
  for (const a of greatFigures.思宗) {
    form.button(`${a}`);
  }
  form.show(player).then((response) => {
    if (response.canceled) {
      selection(player);
    } else {
      const selectedIndex = response.selection;
      const selTag = greatFigures.思宗[selectedIndex];
      player.addTag(`${selTag}`);
      player.runCommandAsync(
        `tellraw @s {"rawtext":[{"text":"${selTag}を選択しました"}]}`
      );
    }
  });
}
function sel_hanhi(player) {
  const form = new ui.ActionFormData();
  for (const a of greatFigures.反非) {
    form.button(`${a}`);
  }
  form.show(player).then((response) => {
    if (response.canceled) {
      selection(player);
    } else {
      const selectedIndex = response.selection;
      const selTag = greatFigures.反非[selectedIndex];
      player.addTag(`${selTag}`);
      player.runCommandAsync(
        `tellraw @s {"rawtext":[{"text":"${selTag}を選択しました"}]}`
      );
    }
  });
}
function sel_tazoku(player) {
  const form = new ui.ActionFormData();
  for (const a of greatFigures.多属) {
    form.button(`${a}`);
  }
  form.show(player).then((response) => {
    if (response.canceled) {
      selection(player);
    } else {
      const selectedIndex = response.selection;
      const selTag = greatFigures.多属[selectedIndex];
      player.addTag(`${selTag}`);
      player.runCommandAsync(
        `tellraw @s {"rawtext":[{"text":"${selTag}を選択しました"}]}`
      );
    }
  });
}
function sel_takukyu(player) {
  const form = new ui.ActionFormData();
  for (const a of greatFigures.探究) {
    form.button(`${a}`);
  }
  form.show(player).then((response) => {
    if (response.canceled) {
      selection(player);
    } else {
      const selectedIndex = response.selection;
      const selTag = greatFigures.探究[selectedIndex];
      player.addTag(`${selTag}`);
      player.runCommandAsync(
        `tellraw @s {"rawtext":[{"text":"${selTag}を選択しました"}]}`
      );
    }
  });
}
function sel_sonota(player) {
  const form = new ui.ActionFormData();
  for (const a of greatFigures.その他) {
    form.button(`${a}`);
  }
  form.show(player).then((response) => {
    if (response.canceled) {
      selection(player);
    } else {
      const selectedIndex = response.selection;
      const selTag = greatFigures.その他[selectedIndex];
      player.addTag(`${selTag}`);
      player.runCommandAsync(
        `tellraw @s {"rawtext":[{"text":"${selTag}を選択しました"}]}`
      );
    }
  });
}

function selection(player) {
  const form = new ui.ActionFormData();
  form.button('科技');
  form.button('芸文');
  form.button('軍政');
  form.button('思宗');
  form.button('反非');
  form.button('多属');
  form.button('拓求');
  form.button('その他');
  form.show(player).then((response) => {
    switch (response.selection) {
      case 0:
        sel_kagi(player);
        break;
      case 1:
        sel_geibun(player);
        break;
      case 2:
        sel_gunsei(player);
        break;
      case 3:
        sel_sishu(player);
        break;
      case 4:
        sel_hanhi(player);
        break;
      case 5:
        sel_tazoku(player);
        break;
      case 6:
        sel_takukyu(player);
        break;
      case 7:
        sel_sonota(player);
        break;
      default:
        selection2(player);
        break;
    }
  });
}

function selection2(player) {
  const form_button = new ui.ActionFormData();
  form_button.button('tag削除');
  form_button.button('スタート');
  form_button.button('tag付与');
  form_button.button('モード変更');
  form_button.show(player).then((response) => {
    switch (response.selection) {
      case 0:
        player.sendMessage('タグを削除しました');
        player.runCommandAsync(`scriptevent nato:del`);
        player.runCommandAsync(`scriptevent nato:clear`);
        break;
      case 1: //スタート
        first_option(player);
        player.runCommandAsync('title @a title start');
        player.runCommandAsync('gamemode a @a');
        break;
      case 2:
        selection(player);
        break;
      case 3:
        selection3(player);
        break;
      default:
        break;
    }
  });
}

function selection3(player) {
  const form_button = new ui.ActionFormData();
  form_button.button('クリエイティブ');
  form_button.button('アドベンチャー');
  form_button.show(player).then((response) => {
    switch (response.selection) {
      case 0:
        player.runCommandAsync('gamemode creative @s');
        break;
      case 1:
        player.runCommandAsync('gamemode adventure @s');
        break;
      default:
        break;
    }
  });
}

function egui(player) {
  const form = new ui.ActionFormData();
  form.title('同盟組もうぜ');
  form.button('ええで');
  form.button('むり');
  let dmg = 0;

  form
    .show(player)
    .then((response) => {
      switch (response.selection) {
        case 0:
          player.runCommandAsync(
            'effect @a[r=5,c=1,tag=ビスマルク外交相手] resistance 0 0 true'
          );
          player.runCommandAsync(
            'effect @a[tag = オットー・フォン・ビスマルク] resistance 0 0 true'
          );
          player.runCommandAsync(
            'tellraw @a {"rawtext":[{"text":"同盟が締結された"}]}'
          );
          yatterukai = 'yatteru';
          player.runCommandAsync(`playsound horn.call.1 @a ~~~ 10.0 1.0 10.0`);
          player.runCommandAsync(
            'tag @a[tag = ビスマルク外交相手] add 同盟相手'
          );
          player.runCommandAsync(`tag @a remove ビスマルク外交相手`);

          const oisiine = server.system.runInterval(() => {
            player.runCommandAsync(
              'execute as @a[tag=同盟相手] at @s positioned ~~~ run effect @a[tag=オットー・フォン・ビスマルク,r=5] resistance 1 1 true'
            );
            player.runCommandAsync(
              'execute as @a[tag=オットー・フォン・ビスマルク] at @s positioned ~~~ run effect @a[tag=同盟相手,r=5] resistance 2 2 true'
            );
            // ダメージを追跡し、同盟を終了
            dmg++; // ダメージ変数をインクリメント
            if (dmg == 100 && yatterukai == 'yatteru') {
              player.runCommandAsync(
                'tellraw @a {"rawtext":[{"text":"同盟がおわっちゃった"}]}'
              );
              player.runCommandAsync('tag @s remove 同盟相手');
              yatterukai = 'yattenai';
              server.system.clearRun(oisiine); // インターバルを停止
            }
          }, 20); // 20ティック（1秒）ごとに実行
          break;

        case 1:
          // 「むり」を選択した場合

          player.runCommandAsync(
            'effect @a[r=5,c=1,tag=ビスマルク外交相手] resistance 0 0 true'
          );
          player.runCommandAsync(
            'effect @a[tag=オットー・フォン・ビスマルク] resistance 0 0 true'
          );
          player.runCommandAsync(
            'tellraw @a {"rawtext":[{"text":"同盟を拒否した"}]}'
          );
          let takaikakuritudeiikurumeraretesimauyo = Math.floor(
            Math.random() * 2
          );
          player.runCommandAsync(`tag @a remove ビスマルク外交相手`);

          if (takaikakuritudeiikurumeraretesimauyo === 0) {
            player.runCommandAsync(
              'tellraw @a {"rawtext":[{"text":"同盟を拒否できたよーん"}]}'
            );
            yatterukai = 'yattenai';
            player.runCommandAsync(
              `playsound random.glass @a ~~~ 10.0 1.0 10.0`
            );
            player.runCommandAsync('tag @s remove 同盟相手');
          } else {
            // ここも無限ループを修正
            player.runCommandAsync(
              'tellraw @a {"rawtext":[{"text":"高い確率で言いくるめられてしまった！！"}]}'
            );
            yatterukai = 'yatteru';
            player.runCommandAsync(
              'tag @a[tag=ビスマルク外交相手] add 同盟相手'
            );
            player.runCommandAsync(
              `playsound horn.call.1 @a ~~~ 10.0 1.0 10.0`
            );
            player.runCommandAsync(`tag @s remove ビスマルク外交相手`);

            oisiine = server.system.runInterval(() => {
              player.runCommandAsync(
                'execute as @a[tag=同盟相手] at @s positioned ~~~ run effect @a[tag=オットー・フォン・ビスマルク,r=5] resistance 1 1 true'
              );
              player.runCommandAsync(
                'execute as @a[tag=オットー・フォン・ビスマルク] at @s positioned ~~~ run effect @a[tag=同盟相手,r=5] resistance 2 2 true'
              );
              dmg++;
              if (dmg == 100 && yatterukai == 'yatteru') {
                player.runCommandAsync(
                  'tellraw @a {"rawtext":[{"text":"同盟がおわっちゃった"}]}'
                );
                player.runCommandAsync('tag @s remove 同盟相手');
                yatterukai = 'yattenai';
                server.system.clearRun(oisiine);
              }
            }, 20);
          }
          break;

        default:
          player.runCommandAsync(
            'effect @a[r=5,c=1,tag=ビスマルク外交相手] resistance 0 0 true'
          );
          player.runCommandAsync(
            'effect @a[tag=オットー・フォン・ビスマルク] resistance 0 0 true'
          );
          player.runCommandAsync(
            'tellraw @a {"rawtext":[{"text":"同盟が締結された"}]}'
          );
          yatterukai = 'yatteru';
          player.runCommandAsync('tag @a[tag=ビスマルク外交相手] add 同盟相手');
          player.runCommandAsync(`playsound horn.call.1 @a ~~~ 10.0 1.0 10.0`);
          player.runCommandAsync(`tag @a remove ビスマルク外交相手`);
          oisiine = server.system.runInterval(() => {
            player.runCommandAsync(
              'execute as @a[tag=同盟相手] at @s positioned ~~~ run effect @a[tag=オットー・フォン・ビスマルク,r=5] resistance 1 1 true'
            );
            player.runCommandAsync(
              'execute as @a[tag=オットー・フォン・ビスマルク] at @s positioned ~~~ run effect @a[tag=同盟相手,r=5] resistance 2 2 true'
            );
            dmg++;
            if (dmg == 100 && yatterukai == 'yatteru') {
              player.runCommandAsync(
                'tellraw @a {"rawtext":[{"text":"同盟がおわっちゃった"}]}'
              );
              player.runCommandAsync('tag @s remove 同盟相手');
              yatterukai = 'yattenai';
              server.system.clearRun(oisiine);
            }
          }, 20);
          break;
      }
    })
    .catch((error) => {
      player.runCommandAsync(
        'effect @a[r=5,c=1,tag=ビスマルク外交相手] resistance 0 0 true'
      );
      player.runCommandAsync(
        'effect @a[tag=オットー・フォン・ビスマルク] resistance 0 0 true'
      );
      player.runCommandAsync(
        'tellraw @a {"rawtext":[{"text":"同盟が締結された"}]}'
      );
      yatterukai = 'yatteru';
      player.runCommandAsync('tag @a[tag=ビスマルク外交相手] add 同盟相手');
      player.runCommandAsync(`tag @a remove ビスマルク外交相手`);

      const oisiine = server.system.runInterval(() => {
        player.runCommandAsync(
          'execute as @a[tag=同盟相手] at @s positioned ~~~ run effect @a[tag=オットー・フォン・ビスマルク,r=5] resistance 1 1 true'
        );
        player.runCommandAsync(
          'execute as @a[tag=オットー・フォン・ビスマルク] at @s positioned ~~~ run effect @a[tag=同盟相手,r=5] resistance 2 2 true'
        );
        dmg++;
        if (dmg == 100 && yatterukai == 'yatteru') {
          player.runCommandAsync(
            'tellraw @a {"rawtext":[{"text":"同盟がおわっちゃった"}]}'
          );
          server.system.clearRun(oisiine);
        }
      }, 20);
    });
}

//下にキャラの初期設定を書いてください
function first_option() {
  for (const startPlayers of server.world.getAllPlayers()) {
    startPlayers.runCommandAsync('give @s minecraft:cooked_beef 64');
    if (startPlayers.hasTag('ジェフリー・ダーマー')) {
      startPlayers.runCommandAsync('scoreboard players set @s tie 10');
      startPlayers.runCommandAsync('give @s nato:handcuffs');
      startPlayers.runCommandAsync('give @s nato:skulll');
      startPlayers.runCommandAsync('give @s nato:acid_potion 10');
      startPlayers.runCommandAsync('give @s minecraft:potion 3 33');
      startPlayers.runCommandAsync('give @s minecraft:iron_axe');
    }
    //以下同じようにお願いします

    if (startPlayers.hasTag('オットー・フォン・ビスマルク')) {
      startPlayers.runCommandAsync('scoreboard players set @s seni 2');
      startPlayers.runCommandAsync('scoreboard players set @s bougo 2');
      startPlayers.runCommandAsync('scoreboard players set @s buryoku 2');
      startPlayers.runCommandAsync('scoreboard players set @s seni');
      startPlayers.runCommandAsync('scoreboard players set @s seni');
      startPlayers.runCommandAsync('give @s minecraft:netherite_helmet');
      startPlayers.runCommandAsync('give @s minecraft:netherite_leggings');
      startPlayers.runCommandAsync('give @s minecraft:netherite_chestplate');
      startPlayers.runCommandAsync('give @s minecraft:iron_sword');
      startPlayers.runCommandAsync('give @s ob:gewehr71');
      startPlayers.runCommandAsync('give @s minecraft:');
    }

    if (startPlayers.hasTag('ニコラ・テスラ')) {
      startPlayers.runCommandAsync('scoreboard players set @s gijutu 7');
      startPlayers.runCommandAsync('scoreboard players set @s tie 5');
      startPlayers.runCommandAsync('scoreboard players set @s bougo 1');
      startPlayers.runCommandAsync('give @s minecraft:mace');
      startPlayers.runCommandAsync('give @s nato:densou');
      startPlayers.runCommandAsync('give @s nato:houden');
      startPlayers.runCommandAsync('give @s nato:denjikai');
      startPlayers.runCommandAsync('give @s nato:rakurai');
      startPlayers.runCommandAsync('give @s nato:tensou');
      startPlayers.runCommandAsync('tag @s add plus');
    }
  }
}

server.world.afterEvents.playerSpawn.subscribe((ev) => {
  ev.player.runCommandAsync('effect @s health_boost infinite 9 true');
  ev.player.runCommandAsync('effect @s instant_health 1 255 true');
  if (ev.initialSpawn == false) {
    ev.player.runCommandAsync('gamemode spectator @s');
  }
});

/*宮沢賢治，銀河鉄道の夜，風の又三郎, 雨ニモ負ケズ,グスコーブドリの伝記，セロ弾きのゴーシュ*/
//↑未来のてらだへ、技のクールタイムのスコアボードは cooltime で固定にしてください。しなかった場合はなんと..................................................................................................................................................................................................一億円プレゼント
server.world.afterEvents.itemUse.subscribe((ev) => {
  if (ev.itemStack.typeId === 'nato:smartphone') {
    selection2(ev.source);
  } else if (
    ev.itemStack.typeId === 'minecraft:iron_ingot' &&
    ev.source.hasTag('宮沢賢治')
  ) {
    ev.source.runCommandAsync('scoreboard players set @s cooltime_1 35');
    ev.source.runCommandAsync('effect @s speed 10 10 true');
    ev.source.runCommandAsync('effect @s jump_boost 10 5 true');
    ev.source.runCommandAsync('scoreboard players set @s matasabuidou 1');
  }

  if (ev.itemStack.typeId === 'minecraft:gold_ingot') {
    ev.source.runCommandAsync('inputpermission set @s camera disabled');
    ev.source.runCommandAsync('inputpermission set @s movement disabled');

    ev.source.runCommandAsync('summon mk:gingatetudou ^^20^-3');
    ev.source.runCommandAsync('summon mk:sazankurosu ^^20^50');
    ev.source.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s run tp @s ~~~ facing @a[tag=宮沢賢治]'
    );
    server.system.runTimeout(() => {
      ev.source.runCommandAsync('inputpermission set @s movement enabled');
      ev.source.runCommandAsync('inputpermission set @s camera enabled');
    }, 20);
    server.system.runTimeout(() => {
      let summy = 0;

      ev.source.runCommandAsync(
        'execute as @e[type=mk:gingatetudou] at @s run tp @s ~~~ facing @e[type=mk:hakutyouteisyaba,c=1]'
      );
      const hersunny = server.system.runInterval(() => {
        summy++;
        //なかでうごかすやーつ

        ev.source.runCommandAsync(
          'execute as @e[type=mk:gingatetudou] at @s unless entity @e[r=2,type=mk:hakutyouteisyaba] run tp @s ^^^2.5'
        );
        if (summy > /*秒数*/ 50) {
          ev.source.runCommandAsync(
            'execute as @e[type=mk:gingatetudou] at @s run tp @s ~~~ facing @e[type=mk:sazankurosu,c=1]'
          );
          const hersunny2 = server.system.runInterval(() => {
            ev.source.runCommandAsync(
              'execute as @e[type=mk:gingatetudou] at @s run tp @s ^^^2.5'
            );
            ev.source.runCommandAsync(
              'execute as @e[type=mk:sazankurosu] at @s run kill @e[r=2,type=mk:gingatetudou]'
            );
            const dimension = server.world.getDimension('overworld');
            const tetudou = dimension.getEntities({ type: 'mk:gingatetudou' });
            if (tetudou.length != 0) {
              return;
            } else {
              ev.source.runCommandAsync('kill @e[type=mk:sazankurosu]');
              server.system.clearRun(hersunny2);
            }
          });
          server.system.clearRun(hersunny);
        }
      });
    }, 30);
  }
  if (ev.itemStack.typeId === 'minecraft:copper_ingot') {
    let nimonimomakezu = 0;
    const amenimonimo = server.system.runInterval(() => {
      nimonimomakezu++;
      //なかでうごかすやーつ
      ev.source.runCommandAsync(
        'execute as @a[tag=宮沢賢治] at @s positioned ~~~ run particle minecraft:weaving_emitter ^^1.5^'
      );
      if (nimonimomakezu > /*秒数*/ 560) {
        server.system.clearRun(amenimonimo);
      }
    });
    var RainIsLoser = [
      '§l§4雨ニモマケズ',
      '§l§4風ニモマケズ',
      '§l§4冬ニモ夏ノ暑サニモマケヌ',
      '§l§4丈夫ナカラダヲモチ',
      '§l欲ハナク',
      '§l§4決シテ瞋ラズ',
      '§lイツモシヅカニワラッテヰル',
      '§l一日ニ玄米四合ト',
      '§l§4味噌ト少シノ野菜ヲタベ',
      '§lアラユルコトヲ',
      '§l§4ジブンヲカンジョウニ入レズニ',
      '§lヨクミキキシワカリ',
      '§l§4ソシテワスレズ',
      '§l野原ノ松ノ林ノ蔭ノ',
      '§l小サナ萓ブキノ小屋ニヰテ',
      '§l東ニ病気ノコドモアレバ',
      '§l§4行ッテ看病シテヤリ',
      '§l西ニツカレタ母アレバ',
      '§l§4行ッテソノ稲ノ束ヲ負ヒ',
      '§l南ニ死ニサウナ人アレバ',
      '§l§4行ッテコハガラナクテモイヽトイヒ',
      '§l北ニケンクワヤソショウガアレバ',
      '§l§4ツマラナイカラヤメロトイヒ',
      '§lヒドリノトキハナミダヲナガシ',
      '§l§4サムサノナツハオロオロアルキ',
      '§lミンナニデクノボートヨバレ',
      '§lホメラレモセズクニモサレズ',
      '§l§4ソウイフモノニワタシハナリタイ',
    ];
    let amedesu = 0;
    const Rain = server.system.runInterval(() => {
      ev.source.runCommandAsync(
        `tellraw @a {"rawtext":[{"text":"${RainIsLoser[amedesu]}"}]}`
      );
      if (RainIsLoser[amedesu] == '§l§4雨ニモマケズ') {
        ev.source.runCommandAsync(
          'effect @a[tag=宮沢賢治] water_breathing 30 255'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c水中呼吸が付与された"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4風ニモマケズ') {
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] bougo 1'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c防護が１上がった"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4冬ニモ夏ノ暑サニモマケヌ') {
        ev.source.runCommandAsync(
          'effect @a[tag=宮沢賢治] fire_resistance 30 255'
        );
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] bougo 1'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c火炎耐性が付与された"}]}'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c防護が１上がった"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4丈夫ナカラダヲモチ') {
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] bougo 1'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c防護が１上がった"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4決シテ瞋ラズ') {
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] seishin 1'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c精神力が１上がった"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4味噌ト少シノ野菜ヲタベ') {
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] heal 1'
        );
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] buryoku 1'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c再生が１上がった"}]}'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c武力が１上がった"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4ジブンヲカンジョウニ入レズニ') {
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] seishin 1'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c精神力が１上がった"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4ソシテワスレズ') {
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] seishin 1'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c精神力が１上がった"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4行ッテ看病シテヤリ') {
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] heal 1'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c再生が１上がった"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4行ッテソノ稲ノ束ヲ負ヒ') {
        ev.source.runCommandAsync('effect @a[tag=宮沢賢治] absorption 30 2');
        ev.source.runCommandAsync('effect @a[tag=宮沢賢治] hunger 15 1');
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c体力が上がった"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4行ッテコハガラナクテモイヽトイヒ') {
        ev.source.runCommandAsync(
          'effect @a[tag=宮沢賢治] night_vision 30 255'
        );
        ev.source.runCommandAsync('effect @a[tag=宮沢賢治] resistance 30 0');
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c耐性が付与された"}]}'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c暗視が付与された"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4ツマラナイカラヤメロトイヒ') {
        ev.source.runCommandAsync('effect @a weakness 10 255 true');
        ev.source.runCommandAsync('effect @a resistance 10 255 true');
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c全員攻撃不可になった"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4サムサノナツハオロオロアルキ') {
        ev.source.runCommandAsync('effect @a[tag=宮沢賢治] speed 30 0');
        ev.source.runCommandAsync('effect @a[tag=宮沢賢治] hunger 15 1 ');
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§cスピードが付与された"}]}'
        );
      }
      if (RainIsLoser[amedesu] == '§l§4ソウイフモノニワタシハナリタイ') {
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] seni 1'
        );
        ev.source.runCommandAsync(
          'scoreboard players add @a[tag=宮沢賢治] seishin 1'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c精神力が１上がった"}]}'
        );
        ev.source.runCommandAsync(
          'tellraw @a {"rawtext":[{"text":"§c戦意が１上がった"}]}'
        );
      }
      amedesu++;
      if (amedesu >= RainIsLoser.length) {
        server.system.clearRun(Rain);
      }
    }, 20);
  } else if (ev.itemStack.typeId === 'minecraft:stick') {
    const seni = get_score('seni', ev.source);
    const satui = get_score('satui', ev.source);
    const tie = get_score('tie', ev.source);
    const gijutu = get_score('gijutu', ev.source);
    const buryoku = get_score('buryoku', ev.source);
    const seishin = get_score('seishin', ev.source);
    const bougo = get_score('bougo', ev.source);
    const heal = get_score('heal', ev.source);
    var maxseni = '';
    var maxsatui = '';
    var maxtie = '';
    var maxgijutu = '';
    var maxburyoku = '';
    var maxseishin = '';
    var maxbougo = '';
    var maxheal = '';
    const maxcolor = '§4';
    if (seni >= 15) {
      maxseni = maxcolor;
    }
    if (satui >= 15) {
      maxsatui = maxcolor;
    }
    if (tie >= 15) {
      maxtie = maxcolor;
    }
    if (gijutu >= 15) {
      maxgijutu = maxcolor;
    }
    if (buryoku >= 15) {
      maxburyoku = maxcolor;
    }
    if (seishin >= 15) {
      maxseishin = maxcolor;
    }
    if (bougo >= 15) {
      maxbougo = maxcolor;
    }
    if (heal >= 15) {
      maxheal = maxcolor;
    }
    ev.source
      .runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e§lーーステータス表示ーー§r
    キャラクター:${ev.source.getTags()}
    §r戦意:${maxseni}${seni}/15
    §r殺意:${maxsatui}${satui}/15
    §r知恵:${maxtie}${tie}/15
    §r技術:${maxgijutu}${gijutu}/15
    §r武力:${maxburyoku}${buryoku}/15
    §r精神力:${maxseishin}${seishin}/15
    §r防護:${maxbougo}${bougo}/15
    §r再生:${maxheal}${heal}/15
    §e§lーーーーーーーーーーー§r
    "}]}`);
  }
});
//ジョージ活動
server.system.runInterval(() => {
  //40tickに1回
  for (const matasaburou of server.world.getAllPlayers()) {
    if (matasaburou.hasTag('宮沢賢治')) {
      //ワールドの人を順番にmatasaburouという名前で取得
      const score = get_score('cooltime_1', matasaburou); //matasaburou(プレイヤー)のcooltime(スコア名)のスコアを取得
      if (score > 0) {
        matasaburou.runCommandAsync('effect @s invisibility 1 10 true');
      }
    } else if (matasaburou.hasTag('ニコラ・テスラ')) {
      if (matasaburou.level < 100) {
        matasaburou.runCommandAsync('xp 5L @s');
      }
    }
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=3}] run effect @a[r=15] regeneration 2 0'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=3}] run scoreboard players add @a[tag=宮沢賢治,r=15] seishin 1'
    );
  }
}, 40 /*tick*/);

server.system.runInterval(() => {
  //20tickに1回
  for (const matasaburou of server.world.getAllPlayers()) {
    if (matasaburou.hasTag('宮沢賢治')) {
      //ワールドの人を順番にmatasaburouという名前で取得
      const score = get_score('cooltime_1', matasaburou); //matasaburou(プレイヤー)のcooltime(スコア名)のスコアを取得
      if (score > 25) {
        matasaburou.runCommandAsync(
          'execute as @s at @s positioned ~~~ run particle minecraft:wind_explosion_emitter ^^2.2^'
        );
      }
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:hakutyouteisyaba] at @s if entity @a[tag=宮沢賢治,r=8] run execute as @a[tag=!宮沢賢治] at @s positioned ~~~ run particle minecraft:trial_omen_emitter ~~2~'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:hakutyouteisyaba] at @s if entity @a[tag=宮沢賢治,r=8] run execute as @e[type=mk:hakutyouteisyaba] at @s positioned ~~~ run particle minecraft:small_soul_fire_flame ^^4.2^-0.3'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:gosyu] at @s positioned ~~~ run scoreboard players add @a[tag=宮沢賢治,r=1.5] gosyu 1'
      );
      matasaburou.runCommandAsync(
        'effect @a[tag=宮沢賢治,scores={"gosyu"=10}] night_vision 15 255'
      );
      matasaburou.runCommandAsync(
        'effect @a[tag=宮沢賢治,scores={"gosyu"=10}] strength 15 0'
      );
      matasaburou.runCommandAsync(
        'effect @a[tag=宮沢賢治,scores={"gosyu"=10}] speed 15 0'
      );
      matasaburou.runCommandAsync(
        'scoreboard players set @a[tag=宮沢賢治,scores={"gosyu"=10..}] gosyu 0'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:gosyu] at @s positioned ~~~ run execute as @a[tag=宮沢賢治,r=1.5,scores={"gosyu"=..9}] at @s positioned ~~~ run particle minecraft:note_particle ^^1.8^0.5'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:gosyu] at @s positioned ~~~ run scoreboard players set @a[tag=宮沢賢治,rm=1.5] gosyu 0'
      );
      matasaburou.runCommandAsync(
        'scoreboard players add @a[tag=宮沢賢治] sankitime 1'
      );
      matasaburou.runCommandAsync(
        'scoreboard players add @a[tag=宮沢賢治,scores={"sankitime"=30..}] sanki 1'
      );
      matasaburou.runCommandAsync(
        'scoreboard players set @a[tag=宮沢賢治,scores={"sanki"=4..}] sanki 1'
      );
      matasaburou.runCommandAsync(
        'scoreboard players set @a[tag=宮沢賢治,scores={"sankitime"=30..}] sankitime 0'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=1}] run effect @a[r=15] slowness 3 1'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=1}] run effect @a[r=15] hunger 3 1'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=1}] run effect @a[r=15] weakness 3 0'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=1}] run particle minecraft:knockback_roar_particle ^^10^'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=2}] run effect @a[tag=宮沢賢治,r=15] darkness 3 255'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=2}] run effect @a[tag=宮沢賢治,r=15] wither 2 0'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=2}] run effect @a[tag=宮沢賢治,r=15] weakness 3 0'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=2}] run effect @a[tag=宮沢賢治,r=15] resistance 3 0'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=2}] run particle minecraft:mobflame_single ^^10^'
      );

      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=3}] run effect @a[r=15] saturation 3 2'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=3}] run effect @a[tag=宮沢賢治,r=15] resistance 3 0'
      );
      matasaburou.runCommandAsync(
        `execute as @e[type=mk:budori] at @s run effect @a[tag=宮沢賢治,scores={"sanki"=3},r=15] strength 3 ${Math.floor(
          Math.min(get_score('buryoku', matasaburou), 15) + 2 / 3
        )}`
      );

      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=3}] run particle minecraft:totem_particle ^^10^'
      );
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=1}] run scoreboard players remove @a[tag=宮沢賢治,scores={"sankitime"=0}] seishin 7'
      );
    } else if (
      matasaburou.hasTag('ニコラ・テスラ') &&
      matasaburou.hasTag('dash')
    ) {
      if (matasaburou.level >= 5 && matasaburou.hasTag('plus')) {
        matasaburou.runCommandAsync('xp -5L @s');
        matasaburou.runCommandAsync('effect @s speed 1 3 true');
        matasaburou.runCommandAsync('particle nato:eleki_emitter ~ ~1 ~');
      } else if (matasaburou.level >= 8 && matasaburou.hasTag('minus')) {
        matasaburou.runCommandAsync('xp -8L @s');
        matasaburou.runCommandAsync('effect @s speed 1 5 true');
        matasaburou.runCommandAsync('particle nato:eleki_emitter ~ ~1 ~');
        onmitsu(matasaburou, get_score('tie', matasaburou));
      } else {
        matasaburou.runCommandAsync('tag @s remove dash');
      }
    }
    for (let cooler = 1; cooler <= 8; cooler++) {
      if (get_score(`cooltime_${cooler}`, matasaburou) > 0) {
        matasaburou.runCommandAsync(
          `scoreboard players remove @s cooltime_${cooler} 1`
        ); //cooltimeの減少
      }
    }
    matasaburou.runCommandAsync('scoreboard players add @s damage 1');
    if (get_score('damage', matasaburou) == 8) {
      matasaburou.runCommandAsync('scoreboard players set @s damage 1');
    }
    matasaburou.runCommandAsync(
      `titleraw @s actionbar{"rawtext":[{"text":"クールタイム［${Math.min(
        get_score('damage', matasaburou),
        8
      )}］：${get_score(
        `cooltime_${Math.min(get_score('damage', matasaburou), 8)}`,
        matasaburou
      )}s"}]}`
    );
  }
}, 20);

server.system.runInterval(() => {
  //1tickに1回
  for (const matasaburou of server.world.getAllPlayers()) {
    if (matasaburou.hasTag('宮沢賢治')) {
      //ワールドの人を順番にmatasaburouという名前で取得
      const score = get_score('cooltime_1', matasaburou); //matasaburou(プレイヤー)のcooltime(スコア名)のスコアを取得
      const matasaburou_score = get_score('matasabuidou', matasaburou);
      if (score > 0) {
        matasaburou.runCommandAsync(
          'execute as @s at @s positioned ~~~ run damage @a[r=2,rm=0.5] 0 self_destruct entity @s'
        );
      }
      if (score == 0 && matasaburou.isSneaking && matasaburou_score === 1) {
        matasaburou.runCommandAsync(
          'execute as @s at @s positioned ~~~ run tp @s @n[type=player,rm=0.5]'
        );
        matasaburou.runCommandAsync(
          'scoreboard players remove @s matasabuidou 1'
        );
        //グッドシンガーまたの名があるのはこの男～～～～陣内智則！！！
      }
    }

    matasaburou.runCommandAsync(
      'execute as @e[type=mk:hakutyouteisyaba] at @s positioned ~~~ run effect @a[tag=宮沢賢治,r=8] invisibility 1 1 true'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:hakutyouteisyaba] at @s positioned ~~~ run effect @a[tag=宮沢賢治,r=8] weakness 1 255 true'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:hakutyouteisyaba] at @s positioned ~~~ run effect @a[tag=宮沢賢治,r=8] hunger 1 1 true'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run effect @a[tag=!宮沢賢治,r=3] hunger 10 1 true'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run effect @a[tag=!宮沢賢治,r=3] weakness 10 255 true'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run effect @a[tag=!宮沢賢治,r=3] invisibility 10 1 true'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run damage @a[r=3] 16 entity_attack entity @s'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run damage @a[r=3] 0 self_destruct entity @a[tag=宮沢賢治]'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run particle minecraft:firefly_particle ^^4^'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run particle mk:ginga ^^4^-13'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=2}] run particle minecraft:lava_particle ^^10^'
    );

    /*matasaburou.runCommandAsync(
      'effect @e[type=armor_stand] invisibility 1 10 true'
    );*/
    matasaburou.runCommandAsync(
      'execute as @e[type=nato:acid_potion_entity] at @s run scoreboard players remove @a[r=2,tag=!ジェフリー・ダーマー] bougo 1'
    );
    var score_inga = [
      'seni',
      'bougo',
      'heal',
      'satui',
      'tie',
      'gijutu',
      'seishin',
      'buryoku',
    ];
    for (const score_name of score_inga) {
      if (get_score(score_name, matasaburou) < 0) {
        matasaburou.runCommandAsync(
          `scoreboard players set @s ${score_name} 0`
        );
      } else if (get_score(score_name, matasaburou) >= 16) {
        matasaburou.runCommandAsync(
          `scoreboard players set @s ${score_name} 15`
        );
      }
    }
    matasaburou.runCommandAsync(
      'execute as @e[name=bisumaru] at @s run particle minecraft:basic_flame_particle ~~1.8~'
    );
    matasaburou.runCommandAsync(
      'effect @a[tag=ジェフリー・ダーマー,hasitem={item=skeleton_skull,location=slot.armor.head}] resistance 1 0 true'
    );
    if (matasaburou.hasTag('ニコラ・テスラ') && matasaburou.level >= 100) {
      matasaburou.runCommandAsync('xp -1L @s');
    }
  }
});

server.system.runInterval(() => {
  //10tickに1回
  for (const matasaburou of server.world.getAllPlayers()) {
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run particle minecraft:water_evaporation_manual ^^9.2^-0.4'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=3}] run particle minecraft:firefly_particle ^^5^'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=3}] run particle minecraft:spore_blossom_ambient_particle ^^10^'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run scoreboard players remove @a[tag=!宮沢賢治,r=3] bougo 1'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run scoreboard players remove @a[tag=!宮沢賢治,r=3] seni 1'
    );
    matasaburou.runCommandAsync(
      'execute as @e[type=mk:gingatetudou] at @s positioned ~~~ run scoreboard players remove @a[tag=!宮沢賢治,r=3] seishin 1'
    );
  }
}, 10);

server.system.runInterval(() => {
  //300tickに1回
  for (const matasaburou of server.world.getAllPlayers()) {
    if (matasaburou.hasTag('宮沢賢治')) {
      matasaburou.runCommandAsync(
        'execute as @e[type=mk:budori] at @s if entity @a[tag=宮沢賢治,scores={"sanki"=2}] run scoreboard players add @a[tag=宮沢賢治,r=15] seishin 2'
      );
    }
  }
}, 300);

function get_score(score_name, player_name) {
  try {
    const scoreboard = server.world.scoreboard; // スコアボードを取得
    let objective = scoreboard.getObjective(score_name); //スコア名を取得
    let score = objective.getScore(player_name.scoreboardIdentity); //player_name(プレイヤー)のscore_name(スコア名)のスコアを取得
    if (score != undefined) {
      //scoreが見つかったとき
      return score; //scoreを取得
    } else {
      return 0; //scoreが見つからなかったとき
    }
  } catch {
    return 0; //scoreboardが定義されていないかも？
  }
}

server.system.afterEvents.scriptEventReceive.subscribe((ev) => {
  //タグ削除
  if (ev.id == 'nato:del') {
    if (ev.sourceType == 'Entity') {
      for (const tagDelete of ev.sourceEntity.getTags()) {
        ev.sourceEntity.runCommand(`tag @s remove ${tagDelete}`);
      }
    } else if (ev.sourceType == 'Block') {
      for (const playera of server.world.getAllPlayers()) {
        for (const tagDelete of playera.getTags()) {
          ev.sourceBlock.dimension.runCommand(`tag @a remove ${tagDelete}`);
        }
      }
    }
  }
  if (ev.id == 'nato:score') {
    var scores = [
      'bougo',
      'buryoku',
      'cooltime_1',
      'cooltime_2',
      'cooltime_3',
      'cooltime_4',
      'cooltime_5',
      'cooltime_6',
      'cooltime_7',
      'cooltime_8',
      'damage',
      'gijutu',
      'heal',
      'matasabuidou',
      'satui',
      'seishin',
      'seni',
      'tie',
      'tp_x',
      'tp_y',
      'tp_z',
      'gosyu',
      'sankitime',
      'sanki',
    ];
    for (const board of scores) {
      ev.sourceEntity.runCommand(`scoreboard objectives add ${board} dummy`);
      ev.sourceEntity.runCommand(`scoreboard players add @a ${board} 0`);
      ev.sourceEntity.runCommand(`say ${board}を作成しました`);
    }
  }
  if (ev.id == 'nato:clear') {
    if (ev.sourceType == 'Entity') {
      ev.sourceEntity.runCommand('scoreboard players set @a buryoku 0');
      ev.sourceEntity.runCommand('scoreboard players set @a seni 0');
      ev.sourceEntity.runCommand('scoreboard players set @a bougo 0');
      ev.sourceEntity.runCommand('scoreboard players set @a heal 0');
      ev.sourceEntity.runCommand('scoreboard players set @a satui 0');
      ev.sourceEntity.runCommand('scoreboard players set @a tie 0');
      ev.sourceEntity.runCommand('scoreboard players set @a matasabuidou 0');
      ev.sourceEntity.runCommand('scoreboard players set @a gijutu 0');
      ev.sourceEntity.runCommand('scoreboard players set @a seishin 0');
      ev.sourceEntity.runCommand('scoreboard players set @a total_time 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_1 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_2 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_3 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_4 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_5 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_6 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_7 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_8 0');
    }
    if (ev.sourceType == 'Block') {
      ev.sourceBlock.dimension.runCommand(
        'scoreboard players set @a buryoku 0'
      );
      ev.sourceBlock.dimension.runCommand('scoreboard players set @a seni 0');
      ev.sourceBlock.dimension.runCommand('scoreboard players set @a bougo 0');
      ev.sourceBlock.dimension.runCommand('scoreboard players set @a heal 0');
      ev.sourceBlock.dimension.runCommand('scoreboard players set @a satui 0');
      ev.sourceBlock.dimension.runCommand('scoreboard players set @a tie 0');
      ev.sourceBlock.dimension.runCommand(
        'scoreboard players set @a matasabuidou 0'
      );
      ev.sourceBlock.dimension.runCommand('scoreboard players set @a gijutu 0');
      ev.sourceBlock.dimension.runCommand(
        'scoreboard players set @a seishin 0'
      );
      ev.sourceBlock.dimension.runCommand(
        'scoreboard players set @a total_time 0'
      );
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_1 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_2 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_3 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_4 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_5 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_6 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_7 0');
      ev.sourceEntity.runCommand('scoreboard players set @a cooltime_8 0');
    }
  }
});

//---因果---
server.world.afterEvents.entityHitEntity.subscribe((ev) => {
  //殺意
  const punchedplayer = ev.hitEntity; //殴られた
  const punchingplayer = ev.damagingEntity; //殴った
  let health = punchedplayer.getComponent('health').currentValue;
  const damage_score = Math.min(get_score('satui', punchingplayer), 9);
  if (punchedplayer.hasTag('ニコラ・テスラ')) {
    const itasugiwarota = Math.random() * 10 + 1;
    if (itasugiwarota > 7) {
      punchedplayer.runCommand('scoreboard players add @s gijutu 1');
    }
  }
  if (damage_score >= 1) {
    /*const value = Math.max(health - 1.2 ** damage_score + 1.2, 0);
  punchedplayer.getComponent('health').setCurrentValue(value);*/
    punchedplayer.runCommand(
      `damage @s ${Math.floor(1.2 ** damage_score)} self_destruct entity "${
        punchingplayer.name
      }"`
    );
  }
});

server.system.runInterval(() => {
  for (const inga_player of server.world.getAllPlayers()) {
    const seni_score = Math.min(get_score('seni', inga_player), 15); //戦意
    if (seni_score >= 1) {
      inga_player.runCommandAsync(
        `effect @s speed 1 ${Math.floor((seni_score - 1) / 3)} true`
      );
    }
    const bougo_score = Math.min(get_score('bougo', inga_player), 15); //防護
    if (bougo_score >= 1) {
      inga_player.runCommandAsync(
        `effect @s resistance 1 ${Math.floor((bougo_score - 1) / 3)} true`
      );
    }
    const heal_score = Math.min(get_score('heal', inga_player), 15); //再生
    inga_player.runCommandAsync('scoreboard players add @s timerrr 1');
    if (heal_score >= 11 && heal_score <= 15) {
      if (get_score('timerrr', inga_player) == 60) {
        const health = inga_player.getComponent('health').currentValue;
        const value = health + 2;
        inga_player.getComponent('health').setCurrentValue(value);
        inga_player.runCommandAsync('scoreboard players set @s timerrr 0');
      }
    }
    if (heal_score >= 6 && heal_score <= 10) {
      if (get_score('timerrr', inga_player) == 100) {
        const health = inga_player.getComponent('health').currentValue;
        const value = health + 2;
        inga_player.getComponent('health').setCurrentValue(value);
        inga_player.runCommandAsync('scoreboard players set @s timerrr 0');
      }
    }
    if (heal_score >= 1 && heal_score <= 5) {
      if (get_score('timerrr', inga_player) == 140) {
        const health = inga_player.getComponent('health').currentValue;
        const value = health + 2;
        inga_player.getComponent('health').setCurrentValue(value);
        inga_player.runCommandAsync('scoreboard players set @s timerrr 0');
      }
    }
    const buryoku_score = Math.min(get_score('buryoku', inga_player), 15); //武力
    if (buryoku_score >= 1) {
      inga_player.runCommandAsync(
        `effect @s strength 1 ${Math.floor((buryoku_score - 1) / 3)} true`
      );
    }
    const satui_score = Math.min(get_score('satui', inga_player), 15); //殺意
    if (satui_score >= 1) {
      inga_player.runCommandAsync(
        `effect @s strength 1 ${Math.floor((satui_score - 1) / 5)} true`
      );
      inga_player.runCommandAsync(
        `effect @s speed 1 ${Math.floor((satui_score - 1) / 5)} true`
      );
      inga_player.runCommandAsync(
        `effect @s night_vision 11 ${Math.floor((satui_score - 1) / 5)} true`
      );
    }
  }
}, 1);
//---因果ここまで---

//---バフ---
function onmitsu(player, power) {
  power = Math.min(power, 15);
  player.runCommandAsync(
    `effect @s invisibility ${(Math.floor((power - 1) / 3) + 1) * 3} 0 true`
  );
}

function ninshikisogai(player, power) {
  power = Math.min(power, 15);
  let seconds = 0;
  const interval = server.system.runInterval(() => {
    player.runCommandAsync(
      `effect @s invisibility ${(Math.floor((power - 1) / 6) + 1) * 6} 0 true`
    );
    seconds += (Math.floor((power - 1) / 6) + 1) * 6 * 2;
    if ((Math.floor((power - 1) / 3) + 1) * 3 < seconds) {
      server.system.clearRun(interval);
    }
  }, (Math.floor((power - 1) / 6) + 1) * 6 * 2 * 20);
}

function hakai(target, power, antipower) {
  // powerとantipowerを最大15に制限
  power = Math.min(power, 15);
  antipower = Math.min(antipower, 15);

  // 計算した効果時間を取得。powerとantipowerの差に基づいて計算
  // 例えば、(power - antipower) * 3 というような単純な式の方が意図が分かりやすいです
  const duration = Math.max(
    0,
    (Math.floor((power - 1) / 3) + 1) * 3 -
      (Math.floor((antipower - 1) / 3) + 1) * 3
  );

  // 計算した効果レベルを取得
  const level = Math.floor(1.1 ** power - 1.1 ** antipower);

  // レベルが負の値にならないように0以上にする
  const effectLevel = Math.max(0, level);

  // コマンドの引数を正しい順序で記述
  // durationとeffectLevelの間にスペースを入れる
  target.runCommandAsync(`effect @s weakness ${duration} ${effectLevel} true`);
}

function donka(target, power, antipower) {
  // powerとantipowerを最大15に制限
  power = Math.min(power, 15);
  antipower = Math.min(antipower, 15);

  // 計算した効果時間を取得
  const duration = Math.max(
    0,
    (Math.floor((power - 1) / 3) + 1) * 3 -
      (Math.floor((antipower - 1) / 3) + 1) * 3
  );

  // 計算した効果レベルを取得
  const level = Math.floor(1.1 ** power - 1.1 ** antipower);

  // レベルが負の値にならないように0以上にする
  const effectLevel = Math.max(0, level);

  // コマンドの引数を正しい順序で記述
  target.runCommandAsync(`effect @s slowness ${duration} ${effectLevel}`);
}

function kyohu(target, power, antipower) {
  power = Math.min(power, 15);
  antipower = Math.min(antipower, 15);
  target.runCommandAsync(
    `effect @s blindness ${Math.max(
      Math.floor(
        (Math.floor((power - 1) / 3) + 1) * 3 -
          (Math.floor((antipower - 1) / 3) + 1) * 3
      ),
      0
    )} ${Math.floor(1.1 ** power - 1.1 ** antipower)}`
  );
  target.runCommandAsync(
    `effect @s hunger ${Math.max(
      Math.floor(
        (Math.floor((power - 1) / 3) + 1) * 3 -
          (Math.floor((antipower - 1) / 3) + 1) * 3
      ),
      0
    )} ${Math.floor(1.1 ** power - 1.1 ** antipower)}`
  );
  //騒音追加予定かも
}
//---バフ, デバフここまで---

/*ジェフリー*/
function kouhun(player, count) {
  player.runCommandAsync(`scoreboard players add @s satui ${count}`);
  player.runCommandAsync(`scoreboard players add @s seni ${count}`);
}

//酒
server.world.beforeEvents.itemUse.subscribe((ev) => {
  if (
    ev.itemStack.typeId === 'minecraft:potion' &&
    ev.source.hasTag('ジェフリー・ダーマー')
  ) {
    ev.source.runCommandAsync(
      'replaceitem entity @s slot.weapon.mainhand 0 air'
    );
    ev.source.runCommandAsync('effect @s hunger 15 0');
    ev.source.runCommandAsync('effect @s nausea 15 1');
    ev.source.runCommandAsync(
      'execute as @s at @s run particle minecraft:witchspell_emitter ~~1~'
    );
    ev.source.runCommandAsync('playsound minecraft:entity.witch.drink');
    ev.source.runCommandAsync('scoreboard players remove @s seishin 1');
    ev.source.runCommandAsync('scoreboard players remove @s tie 1');
    kouhun(ev.source, 1);
    ev.source.runCommandAsync('playsound random.drink @a ~~~ 1.0 1.0 0.0');
  }
  if (
    ev.source.hasTag('ジェフリー・ダーマー') &&
    ev.itemStack.typeId === 'nato:skulll' &&
    get_score('cooltime_1', ev.source) == 0
  ) {
    kouhun(ev.source, 2);
    ev.source.runCommandAsync(
      'replaceitem entity @s slot.armor.head 0 skeleton_skull'
    );
    ev.source.runCommandAsync('scoreboard players set @s cooltime_1 45');
    ev.source.runCommandAsync('particle minecraft:egg_destroy_emitter ~ ~1 ~');
    ev.source.runCommandAsync('playsound armor.equip_iron @a ~~~ 1.0 1.0 0.0');
  }
});

server.world.afterEvents.entityHitEntity.subscribe((ev) => {
  if (ev.damagingEntity.hasTag('ジェフリー・ダーマー')) {
    if (
      ev.damagingEntity
        .getComponent('inventory')
        .container.getItem(ev.damagingEntity.selectedSlotIndex).typeId ===
        'nato:handcuffs' &&
      get_score('cooltime_2', ev.damagingEntity) == 0
    ) {
      ev.damagingEntity.runCommand('scoreboard players set @s cooltime_2 30');
      const tie_score = get_score('tie', ev.damagingEntity);
      const seishin_score = get_score('seishin', ev.hitEntity);
      kyohu(ev.hitEntity, tie_score, seishin_score);
      donka(ev.hitEntity, tie_score, seishin_score);
      ev.hitEntity.runCommand('scoreboard players add @s cooltime_1 10');
      ev.hitEntity.runCommand('scoreboard players add @s cooltime_2 10');
      ev.hitEntity.runCommand('scoreboard players add @s cooltime_3 10');
      ev.hitEntity.runCommand('scoreboard players add @s cooltime_4 10');
      ev.hitEntity.runCommand('scoreboard players add @s cooltime_5 10');
      ev.hitEntity.runCommand('scoreboard players add @s cooltime_6 10');
      ev.hitEntity.runCommand('scoreboard players add @s cooltime_7 10');
      ev.hitEntity.runCommand('scoreboard players add @s cooltime_8 10');
      ev.damagingEntity.runCommand(
        'particle minecraft:magic_critical_hit_emitter ~~1~'
      );
      ev.damagingEntity.runCommand(
        'playsound mob.blaze.hit @a ~~~ 1.0 1.0 0.0'
      );
    } else if (
      ev.damagingEntity
        .getComponent('inventory')
        .container.getItem(ev.damagingEntity.selectedSlotIndex).typeId ===
        'minecraft:iron_axe' &&
      get_score('damage', ev.damagingEntity) >= 7 &&
      get_score('cooltime_3', ev.damagingEntity) == 0
    ) {
      let Randooom = Math.floor(Math.random() * 10 + 1);
      if (Randooom >= 70 / get_score('damage', ev.damagingEntity)) {
        ev.damagingEntity.runCommand('effect @s regeneration 5 1 true');
        ev.damagingEntity.runCommand(
          'particle minecraft:trial_spawner_detection ~~1~'
        );
        ev.damagingEntity.runCommand('playsound random.eat @a ~~~ 1.0 1.0 0.0');
      }
    }
  } else if (ev.hitEntity.hasTag('ジェフリー・ダーマー')) {
    ev.hitEntity.runCommand('replaceitem entity @s slot.armor.head 0 air');
    ev.hitEntity.runCommand('playsound random.break @a ~~~ 1.0 1.0 0.0');
  }
});
/*ジェフリーここまで*

/*テスラここから*/
// プレイヤーを中心とした円形にパーティクルを生成する関数
function circle_particle(player, range, particleName) {
  const nowX = player.location.x;
  const nowZ = player.location.z;
  for (let angle = 0; angle < 360; angle += 10) {
    const rad = angle * (Math.PI / 180);
    const xOffset = range * Math.cos(rad);
    const zOffset = range * Math.sin(rad);
    const particleX = nowX + xOffset;
    const particleZ = nowZ + zOffset;
    player.runCommandAsync(
      `particle ${particleName} ${particleX} ${
        player.location.y + 1
      } ${particleZ} `
    );
  }
}
function bolt_change(bolt_man) {
  if (bolt_man.hasTag('plus')) {
    bolt_man.runCommandAsync('tag @s remove plus');
    bolt_man.runCommandAsync('tag @s add minus');
    bolt_man.runCommandAsync(
      'tellraw @s {"rawtext":[{"text":"§9マイナスモードに変換"}]}'
    );
  } else if (bolt_man.hasTag('minus')) {
    bolt_man.runCommandAsync('tag @s remove minus');
    bolt_man.runCommandAsync('tag @s add plus');
    bolt_man.runCommandAsync(
      'tellraw @s {"rawtext":[{"text":"§cプラスモードに変換"}]}'
    );
  } else if (bolt_man.hasTag('plus') && bolt_man.hasTag('minus')) {
    bolt_man.runCommandAsync('tag @s remove minus');
    bolt_man.runCommandAsync(
      'tellraw @s {"rawtext":[{"text":"§cプラスモードに変換"}]}'
    );
  } else {
    bolt_man.runCommandAsync('tag @s add plus');
    bolt_man.runCommandAsync(
      'tellraw @s {"rawtext":[{"text":"§cプラスモードに変換"}]}'
    );
  }
  bolt_man.runCommandAsync('playsound open.iron_trapdoor @a ~~~ 1.0 1.0 0.0');
}

server.world.beforeEvents.itemUse.subscribe((ev) => {
  if (ev.source.hasTag('ニコラ・テスラ')) {
    let boltpower = ev.source.level;
    if (ev.itemStack.typeId == 'minecraft:mace') {
      //モード変化
      if (ev.source.isSneaking) {
        const nowX = ev.source.location.x;
        const nowZ = ev.source.location.z;
        const nowY = ev.source.location.y;
        ev.source.runCommandAsync(
          `scoreboard players set @s tp_x ${Math.floor(nowX)}`
        );
        ev.source.runCommandAsync(
          `scoreboard players set @s tp_y ${Math.floor(nowY)}`
        );
        ev.source.runCommandAsync(
          `scoreboard players set @s tp_z ${Math.floor(nowZ)}`
        );
        ev.source.runCommandAsync(
          `tellraw @s {"rawtext":[{"text":"転送位置を(${Math.floor(
            nowX
          )},${Math.floor(nowY)},${Math.floor(nowZ)})に設定しました"}]}`
        );
        ev.source.runCommandAsync(
          'playsound beacon.activate @a ~~~ 1.0 1.0 0.0'
        );
      } else {
        bolt_change(ev.source);
      }
    } else if (
      ev.itemStack.typeId == 'nato:denjikai' &&
      get_score('cooltime_1', ev.source) == 0
    ) {
      //電磁界
      if (boltpower >= 20 && ev.source.hasTag('minus')) {
        circle_particle(ev.source, 20, 'minecraft:huge_explosion_emitter');
        ev.source.runCommandAsync('xp -20L @s');
        ev.source.runCommandAsync(
          'playsound mob.wither.hurt @a ~~~ 1.0 1.0 0.0'
        );
        for (const near of near_man(ev.source, 20)) {
          hakai(near, get_score('tie', ev.source), get_score('seishin', near));
          donka(near, get_score('tie', ev.source), get_score('seishin', near));
        }
      } else if (boltpower >= 10 && ev.source.hasTag('plus')) {
        circle_particle(ev.source, 10, 'minecraft:huge_explosion_emitter');
        ev.source.runCommandAsync('xp -10L @s');
        ev.source.runCommandAsync(
          'playsound mob.wither.hurt @a ~~~ 1.0 1.0 0.0'
        );
        for (const near of near_man(ev.source, 10)) {
          hakai(near, get_score('tie', ev.source), get_score('seishin', near));
          donka(near, get_score('tie', ev.source), get_score('seishin', near));
        }
      }
    } else if (
      //転送
      ev.itemStack.typeId == 'nato:tensou' &&
      get_score('cooltime_1', ev.source) == 0
    ) {
      if (boltpower >= 20 && ev.source.hasTag('plus')) {
        let waittime = 10;
        ev.source.runCommandAsync('scoreboard players set @s cooltime_1 15');
        if (waittime >= 0) {
          const tpkamo = server.system.runInterval(() => {
            ev.source.runCommandAsync(
              `tellraw @s {"rawtext":[{"text":"転送準備中...${waittime}秒前"}]}`
            );
            ev.source.runCommandAsync(
              'playsound random.orb @a ~~~ 1.0 1.0 0.0'
            );
            ev.source.runCommandAsync('particle nato:eleki_emitter ~ ~1 ~');
            ev.source.runCommandAsync(
              `particle nato:eleki_emitter ${get_score(
                'tp_x',
                ev.source
              )} ${get_score('tp_y', ev.source)} ${get_score(
                'tp_z',
                ev.source
              )}`
            );
            waittime--;
            if (waittime === 0) {
              ev.source.runCommandAsync(
                'playsound portal.travel @a ~~~ 1.0 1.0 0.0'
              );
              ev.source.runCommandAsync('xp -20L @s');
              ev.source.runCommandAsync(
                `tp @s ${get_score('tp_x', ev.source)} ${get_score(
                  'tp_y',
                  ev.source
                )} ${get_score('tp_z', ev.source)}`
              );
              ev.source.runCommandAsync(
                `tellraw @s {"rawtext":[{"text":"転送完了"}]}`
              );
              ev.source.runCommandAsync(
                'scoreboard players set @s cooltime_1 5'
              );
              server.system.clearRun(tpkamo);
            }
          }, 20);
        }
      } else if (boltpower >= 45 && ev.source.hasTag('minus')) {
        let waittime = 3;
        ev.source.runCommandAsync('scoreboard players set @s cooltime_1 8');
        if (waittime >= 0) {
          const tpkamo = server.system.runInterval(() => {
            ev.source.runCommandAsync(
              `tellraw @s {"rawtext":[{"text":"転送準備中...${waittime}秒前"}]}`
            );
            ev.source.runCommandAsync(
              'playsound random.orb @a ~~~ 1.0 1.0 0.0'
            );
            ev.source.runCommandAsync('particle nato:eleki_emitter ~ ~1 ~');
            ev.source.runCommandAsync(
              `particle nato:eleki_emitter ${get_score(
                'tp_x',
                ev.source
              )} ${get_score('tp_y', ev.source)} ${get_score(
                'tp_z',
                ev.source
              )}`
            );
            waittime--;
            if (waittime === 0) {
              ev.source.runCommandAsync(
                'playsound portal.travel @a ~~~ 1.0 1.0 0.0'
              );
              ev.source.runCommandAsync('xp -45L @s');
              ev.source.runCommandAsync(
                `tp @s ${get_score('tp_x', ev.source)} ${get_score(
                  'tp_y',
                  ev.source
                )} ${get_score('tp_z', ev.source)}`
              );
              ev.source.runCommandAsync(
                `tellraw @s {"rawtext":[{"text":"転送完了"}]}`
              );
              server.system.clearRun(tpkamo);
            }
          }, 20);
        }
      }
    } else if (
      //放電
      ev.itemStack.typeId == 'nato:houden' &&
      get_score('cooltime_1', ev.source) == 0
    ) {
      if (boltpower >= 10 && ev.source.hasTag('plus')) {
        ev.source.runCommandAsync('scoreboard players set @s cooltime_1 5');
        ev.source.runCommandAsync('xp -10L @s');
        ev.source.runCommandAsync(
          'execute as @s at @s run summon armor_stand lightning ^^1^'
        );
        ev.source.runCommandAsync(
          `execute as @e[type=armor_stand,name=lightning] at @s rotated as ${ev.source.name} run tp @s ~~~ ~~`
        );
        let anpangatabetai = 35;
        if (anpangatabetai >= 0) {
          const susumelight = server.system.runInterval(() => {
            ev.source.runCommandAsync(
              `execute as @e[type=armor_stand,name=lightning] at @s run tp ^^^1`
            );
            ev.source.runCommandAsync(
              'execute as @e[type=armor_stand,name=lightning] at @s run particle nato:spark ~~1~'
            );
            ev.source.runCommandAsync(
              `execute as @e[type=armor_stand,name=lightning] at @s run damage @a[r=2,tag=!ニコラ・テスラ] ${Math.floor(
                get_score('gijutu', ev.source) * Math.random()
              )} lightning`
            );
            for (let kusoga = 0; kusoga <= 8; kusoga++) {
              ev.source.runCommandAsync(
                `execute as @e[type=armor_stand,name=lightning] at @s run scoreboard players add @a[r=2,tag=!ニコラ・テスラ] cooltime_${kusoga} 3`
              );
            }
            ev.source.runCommandAsync(
              'execute as @e[type=armor_stand,name=lightning] at @s run effect @a[r=2,tag=!ニコラ・テスラ] slowness 3 1'
            );
            ev.source.runCommandAsync(
              'execute as @e[type=armor_stand,name=lightning] at @s run scoreboard players remove @a[r=2,tag=!ニコラ・テスラ] bougo 1'
            );
            ev.source.runCommandAsync(
              'execute as @e[type=armor_stand,name=lightning] at @s run playsound ambient.weather.thunder @a ~~~ 0.1 1.0 0.0'
            );
            anpangatabetai--;
            if (anpangatabetai === 0) {
              ev.source.runCommandAsync(
                'kill @e[type=armor_stand,name=lightning]'
              );
              server.system.clearRun(susumelight);
            }
          });
        }
      } else if (boltpower >= 15 && ev.source.hasTag('minus')) {
        ev.source.runCommandAsync('scoreboard players set @s cooltime_1 5');
        ev.source.runCommandAsync('xp -15L @s');
        ev.source.runCommandAsync(
          'execute as @s at @s run summon armor_stand lightning ^1^^1'
        );
        ev.source.runCommandAsync(
          'execute as @s at @s run summon armor_stand lightning ^-1^^1'
        );
        ev.source.runCommandAsync(
          'execute as @s at @s run summon armor_stand lightning ^^^1'
        );
        ev.source.runCommandAsync(
          `execute as @e[type=armor_stand,name=lightning] at @s rotated as ${ev.source.name} run tp @s ~~~ ~~`
        );
        let anpangatabetai = 40;
        if (anpangatabetai >= 0) {
          const susumelight = server.system.runInterval(() => {
            ev.source.runCommandAsync(
              `execute as @e[type=armor_stand,name=lightning] at @s run tp ^^^1`
            );
            ev.source.runCommandAsync(
              'execute as @e[type=armor_stand,name=lightning] at @s run particle nato:spark ~~1~'
            );
            ev.source.runCommandAsync(
              `execute as @e[type=armor_stand,name=lightning] at @s run damage @a[r=2,tag=!ニコラ・テスラ] ${Math.floor(
                get_score('gijutu', ev.source) * Math.random() + 3
              )} lightning`
            );
            for (
              let sleepydesuyene = 1;
              sleepydesuyene >= 8;
              sleepydesuyene++
            ) {
              ev.source.runCommandAsync(
                `execute as @e[type=armor_stand,name=lightning] at @s run scoreboard players add @a[r=2,tag=!ニコラ・テスラ] cooltime_${sleepydesuyene} 3`
              );
            }
            ev.source.runCommandAsync(
              'execute as @e[type=armor_stand,name=lightning] at @s run effect @a[r=2,tag=!ニコラ・テスラ] slowness 3 1'
            );
            ev.source.runCommandAsync(
              'execute as @e[type=armor_stand,name=lightning] at @s run scoreboard players remove @a[r=2,tag=!ニコラ・テスラ] bougo 1'
            );
            ev.source.runCommandAsync(
              'execute as @e[type=armor_stand,name=lightning] at @s run playsound ambient.weather.thunder @a ~~~ 0.1 1.0 0.0'
            );
            anpangatabetai--;
            if (anpangatabetai === 0) {
              ev.source.runCommandAsync(
                'kill @e[type=armor_stand,name=lightning]'
              );
              server.system.clearRun(susumelight);
            }
          });
        }
      }
    } else if (
      //雷撃
      ev.itemStack.typeId == 'nato:rakurai' &&
      get_score('cooltime_1', ev.source) == 0
    ) {
      if (boltpower >= 50 && ev.source.hasTag('plus')) {
        ev.source.runCommandAsync('scoreboard players set @s cooltime_1 20');
        ev.source.runCommandAsync('xp -50L @s');
        const man = near_man(ev.source, 20);
        const bolt_mean = man[0];
        ev.source.runCommandAsync(
          `execute as ${bolt_mean.name} at @s run summon lightning_bolt ${
            bolt_mean.location.x - Math.random() * 5
          } ${bolt_mean.location.y} ${bolt_mean.location.z - Math.random() * 5}`
        );
      } else if (boltpower >= 75 && ev.source.hasTag('minus')) {
        ev.source.runCommandAsync('scoreboard players set @s cooltime_1 20');
        ev.source.runCommandAsync('xp -75L @s');
        const man = near_man(ev.source, 25);
        for (const bolt_mean of man) {
          ev.source.runCommandAsync(
            `execute as ${bolt_mean.name} at @s run summon lightning_bolt ${
              bolt_mean.location.x - Math.random() * 3
            } ${bolt_mean.location.y} ${
              bolt_mean.location.z - Math.random() * 3
            }`
          );
        }
      }
    } else if (
      //伝送掲示板
      ev.itemStack.typeId == 'nato:densou' &&
      get_score('cooltime_1', ev.source) == 0
    ) {
      if (
        boltpower >= 1 &&
        ev.source.hasTag('plus') &&
        !ev.source.hasTag('dash')
      ) {
        ev.source.runCommandAsync('scoreboard players set @s cooltime_1 3');
        ev.source.runCommandAsync('tag @s add dash');
        onmitsu(ev.source, get_score('tie', ev.source));
        ev.source.runCommandAsync(
          'playsound respawn_anchor.deplete @a ~~~ 1.0 1.0 0.0'
        );
      } else if (
        boltpower >= 3 &&
        ev.source.hasTag('minus') &&
        !ev.source.hasTag('dash')
      ) {
        ev.source.runCommandAsync('scoreboard players set @s cooltime_1 3');
        ev.source.runCommandAsync('tag @s add dash');
      } else if (ev.source.hasTag('dash')) {
        ev.source.runCommandAsync('tag @s remove dash');
        ev.source.runCommandAsync('effect @s slowness 3 2 true');
        ev.source.runCommandAsync(
          'particle minecraft:egg_destroy_emitter ~ ~1 ~'
        );
        ev.source.runCommandAsync(
          'playsound respawn_anchor.deplete @a ~~~ 1.0 1.0 0.0'
        );
      }
    }
  }
});
/*テスラここまで*/

/*gewehr71
弾丸を消費することで使用できるボルトアクションライフル。

  えぐい外交
半径nmの相手に同盟を申し出る。同盟相手の半径nmの範囲にいるとお互いの防御力が上昇する。相手に同盟を拒まれた場合、まれにえぐい外交テクを駆使し、同盟を組める可能性がある。

　えぐい裏切り
2分の1の確率で同盟相手を裏切ることができる。裏切りに成功すると誰にも通知されずに同盟を解除し、失敗すると全プレイヤーに裏切ろうとしたことが通知され、同盟は継続される。

　資材提供
自分のハートを3消費し、同盟相手に防御力上昇を付与する。

　鉄血がいくで
相手を狙い続ける兵士を複数召喚し、20秒後に兵士が消滅する。
*/

//うんここげきから下、立ち入り禁止
function gewehr1871(player) {
  player.runCommandAsync('summon armor_stand bisumaru ~ ~ ~');
  player.runCommandAsync(
    `execute as @e[name=bisumaru] at @s rotated as ${player.name} run tp @s ~~~ ~~`
  );
  let yeah = 0;
  let yoo = server.system.runInterval(() => {
    player.runCommandAsync(`execute as @e[name=bisumaru] at @s run tp ^^^1`);
    yeah++;
    if (yeah === 30) {
      player.runCommandAsync('kill @e[name=bisumaru]');
      server.system.clearRun(yoo); //AIはclearRunをclearRunIntervalだと嘘をつく
    }
  }, 1);
}
server.world.afterEvents.itemUse.subscribe((ev) => {
  if (ev.itemStack.nameTag === 'Gewehr71') {
    if (ev.source.hasTag('オットー・フォン・ビスマルク')) {
      gewehr1871(ev.source);
    } else {
      ev.source.runCommandAsync(
        `tellraw @s  {"rawtext":[{"text":"あなたは逆ビスマルクです"}]}`
      );
    }
  } else if (ev.itemStack.typeId === 'ob:gewehr71') {
    ev.source.runCommandAsync(
      'playsound crossbow.loading.start @a ~~~ 0.5 1.0 0'
    );
  }
});

server.world.afterEvents.itemReleaseUse.subscribe((ev) => {
  if (ev.itemStack.typeId === 'ob:gewehr71') {
    ev.source.runCommandAsync('playsound random.explode @a ~~~ 0.5 1.0 0');
  }
});

//---銃ここまで---

function near_man(source, range) {
  // 1. sourceエンティティの有効性チェック
  if (!source || !source.isValid || !source.location) {
    // source (アーマースタンド) が無効な場合は空の配列を返す
    return [];
  }

  // 2. プレイヤーをフィルタリングする際の厳密なチェック
  return server.world.getAllPlayers().filter((player) => {
    // playerが無効、または位置情報を持っていない場合は除外
    if (!player || !player.isValid || !player.location) {
      return false;
    }

    // プレイヤー自身を除外（不要かもしれませんが安全のため残します）
    if (player === source) {
      return false;
    }

    // **この下の行がindex.js:1892付近だと思われます**
    const dx = player.location.x - source.location.x;
    const dy = player.location.y - source.location.y;
    const dz = player.location.z - source.location.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return distance <= range;
  });
}

var yatterukai = 'yattenai';

server.world.afterEvents.itemUse.subscribe((ev) => {
  if (
    ev.itemStack.typeId === 'nato:gaikou' &&
    ev.source.hasTag('オットー・フォン・ビスマルク') &&
    get_score('cooltime', ev.source) == 0
  ) {
    var gaiko = near_man(ev.source, 5);
    if (gaiko.length === 0) {
      ev.source.runCommandAsync(
        `tellraw @s  {"rawtext":[{"text":"外交相手がおらへん"}]}`
      );
    } else {
      gaiko[0].addTag('ビスマルク外交相手');

      var gaikouaite = gaiko[0].name;

      var tagnonamaedayo = gaiko[0];

      let dmg = 0;

      ev.source.runCommandAsync(`playsound horn.call.0 @a  ~~~ 10.0 1.0 10.0`);
      ev.source.runCommandAsync(
        `tellraw @a  {"rawtext":[{"text":"ビスマルクが${gaikouaite}と外交を開始した"}]}`
      );
      ev.source.runCommandAsync(
        'effect @a[r=5,c=2,tag=ビスマルク外交相手] resistance 255 255 true'
      );
      ev.source.runCommandAsync(
        'effect @a[tag=オットー・フォン・ビスマルク] resistance 255 255 true'
      );
      egui(gaiko[0]);
      ev.source.runCommandAsync(
        'effect @a[r=5,c=2,tag=ビスマルク外交相手] resistance 0 0 true'
      );
      if (doumeiwokumu === 'nice') {
        for (let gomikasu = 0; gomikasu < 100; gomikasu++) {}
      }
    }
  }
});
//get_score('cooltime',ev.source) == 0
server.world.beforeEvents.itemUse.subscribe((ev) => {
  if (
    ev.itemStack.typeId === 'nato:sizai' &&
    ev.source.hasTag('オットー・フォン・ビスマルク')
  ) {
    ev.source.runCommandAsync(
      `tellraw @a  {"rawtext":[{"text":"ビスマルクが同盟相手に資材を提供した"}]}`
    );
    ev.source.runCommandAsync(`damage @s 6`);
    //scoreboard players add herasunnyattararemoveyade sonomamasettonaraset @a sukoameino 12兆      herasunnyattara
    ev.source.runCommandAsync(
      `scoreboard players add @a[tag=同盟相手] bougo 6`
    );
    let momunayokasu = 0;
    const sizaiAgeyou = server.system.runInterval(() => {
      momunayokasu++;
      if (momunayokasu == 15) {
        ev.source.runCommandAsync(
          `scoreboard players remove @a[tag=同盟相手] bougo 6`
        );
        server.system.clearRun(sizaiAgeyou);
      }
    }, 20);
    ev.source.runCommandAsync(
      `tellraw @a  {"rawtext":[{"text":"資材をもらってうれしすぎて同盟相手は15秒間防護が上昇した"}]}`
    );
  }
});

server.world.beforeEvents.itemUse.subscribe((ev) => {
  if (
    ev.itemStack.typeId === 'nato:uragiri' &&
    ev.source.hasTag('オットー・フォン・ビスマルク')
  ) {
    let uragiri = Math.floor(Math.random() * 10);
    if (uragiri <= 5) {
      ev.source.runCommandAsync(
        `tellraw @s {"rawtext":[{"text":"裏切りに成功した"}]}`
      );
      yatterukai = 'yatteru';
      ev.source.runCommandAsync(`tag @a remove ビスマルク外交相手`);
      ev.source.runCommandAsync(`tag @a remove 同盟相手`);
    }
    if (uragiri > 5) {
      ev.source.runCommandAsync(
        `tellraw @a {"rawtext":[{"text":"ビスマルクが裏切ろうとしたけど失敗したから気を付けてね"}]}`
      );
      yatterukai = 'yattenai';
    }
  }
});

server.world.beforeEvents.itemUse.subscribe((ev) => {
  if (
    ev.itemStack.typeId === 'nato:tessetu' &&
    ev.source.hasTag('オットー・フォン・ビスマルク')
  ) {
    for (let i = 0; i <= 10; i++) {
      ev.source.runCommandAsync(`summon nato:bloodhuman 血と鉄の化身君 ~~~`);
    }
    let tetuotoko = 0;
    ev.source.runCommandAsync(
      `damage @e[type=nato:bloodhuman,name=血と鉄の化身君] 0 fire entity @a[tag=!オットー・フォン・ビスマルク,tag=!同盟相手,c=1]`
    );
    const tiwonome = server.system.runInterval(() => {
      server.world.getAllPlayers().forEach((player) => {
        player.runCommandAsync(
          `damage @e[type=nato:bloodhuman,name=血と鉄の化身君] 0 fire entity @a[tag=!オットー・フォン・ビスマルク,tag=!同盟相手,c=1]`
        );
      });
    }, 200);
    const ahareMeisakukun = server.system.runInterval(() => {
      tetuotoko++;
      if (tetuotoko === 20) {
        ev.source.runCommandAsync(`kill @e[name=血と鉄の化身君]`);
        server.system.clearRun(tiwonome);
        server.system.clearRun(ahareMeisakukun);
      }
    }, 20);
  }
});

//一秒を数えろ
let dmg = 0;
function momimomisurunohayokunaitteittenndayo() {
  dmg++;
  return dmg;
}

// 暖かな春の風に吹かれて　私たちは　出会った　よそよそしかったあの頃　今ではきらきら　溢れる笑顔たち　こんな日がずっと続けば　いいな一緒に笑ったり　一緒に泣いたり　全部大切な宝物　夢に向かって　ちんこ　立ち止まる日もある　だけど一人じゃない　明日へ向かって　ちんこ　大きく力強くはばたく　心は　心は　心は　心は　心は　心は　いつもそばに
//playsound horn.call.0 @a  ~~~ 10.0 1.0 10.0

//シュレーディング

//コロンブス
// パーティクル設定
const PARTICLE_NAME = 'minecraft:sculk_soul_particle'; // 表示したいパーティクルのID
const STEPS_PER_BLOCK = 1; // 1ブロックあたり何点のパーティクルを置くか (数値が大きいほど滑らか)

function drawAreaBoundary(
  player,
  areaName,
  displayY = player.location.y + 1.0
) {
  const polygon = definedAreas.get(areaName);
  if (!polygon) return;

  const n = polygon.length;

  let currentStep = 0; // 全体の描画ステップカウンター

  // 非同期かつ分散実行のためのヘルパー関数
  const runDrawStep = () => {
    // 描画のチャンクサイズを決定（1ティックあたりに処理するパーティクルの数）
    const CHUNK_SIZE = 20;
    let commandsExecuted = 0;

    // 現在のステップからチャンクサイズ分だけ描画を試みる
    for (let i = 0; i < n && commandsExecuted < CHUNK_SIZE; i++) {
      const start = polygon[i];
      const end = polygon[(i + 1) % n];

      const dx = end.x - start.x;
      const dz = end.z - start.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      const numSteps = Math.ceil(distance * STEPS_PER_BLOCK);

      // 現在のステップがこの線分に含まれているかチェック
      if (
        currentStep >= commandsExecuted &&
        currentStep < commandsExecuted + numSteps + 1
      ) {
        const stepInSegment = currentStep - commandsExecuted;

        const ratio = stepInSegment / numSteps;

        const particleX = start.x + dx * ratio;
        const particleZ = start.z + dz * ratio;
        const particleY = displayY;

        const cmd = `particle ${PARTICLE_NAME} ${particleX} ${particleY} ${particleZ}`;
        player.runCommandAsync(cmd);

        commandsExecuted++;
        currentStep++; // 全体のステップを進める
      } else {
        // この線分は飛ばし、次の線分に進む
        commandsExecuted += numSteps + 1;
      }
    }

    // 全てのパーティクルを描画し終わったかチェック
    // 注：これは簡易チェック。より正確な全体のステップ数計算が必要だが、ここでは簡略化。
    if (commandsExecuted >= CHUNK_SIZE || currentStep < n * 50) {
      // n*50は仮の最大ステップ数
      server.system.run(runDrawStep); // 次のティックで残りの描画を継続
    }
  };

  // 描画開始
  server.system.run(runDrawStep);
}

const playerPaths = new Map();

// 確定した領域を保存するMap。キーは領域名。
const definedAreas = new Map();

// 経路を記録する際の最小移動距離の2乗 (例: 2ブロック移動したら記録)
const MIN_DISTANCE_SQUARED = 4;

function recordPlayerLocation(player) {
  const playerId = player.id;
  const location = player.location;

  if (!playerPaths.has(playerId)) {
    playerPaths.set(playerId, []);
  }

  const path = playerPaths.get(playerId);

  // 最初の点、または十分な距離を移動した場合のみ記録
  if (path.length === 0) {
    // Y座標は領域判定に使わないため、XとZのみ記録
    path.push({ x: location.x, z: location.z });
    player.sendMessage('§a経路の記録を開始しました。');
    return;
  }

  const lastPoint = path[path.length - 1];

  // 距離の2乗で効率的に判定
  const dx = location.x - lastPoint.x;
  const dz = location.z - lastPoint.z;
  const distanceSquared = dx * dx + dz * dz;

  if (distanceSquared >= MIN_DISTANCE_SQUARED) {
    path.push({ x: location.x, z: location.z });
  }
}

/**
 * 確定済みの領域を削除します。
 * @param {import('@minecraft/server').Player} player 削除コマンドを実行するプレイヤー
 * @param {string} areaName 削除したい領域の名前
 */
function deleteArea(player, areaName) {
  if (definedAreas.has(areaName)) {
    // Mapから領域を削除
    definedAreas.delete(areaName);

    if (areaName == 'ocean') {
      player.sendMessage('領海が消えた...');
    } else {
      player.sendMessage(`§6領域「${areaName}」を削除しました。`);
    }
  }
}

function finalizeArea(player, areaName) {
  const playerId = player.id;
  const path = playerPaths.get(playerId);

  if (!path || path.length < 3) {
    player.sendMessage('§c領域として確定するには、3点以上の座標が必要です。');
    return;
  }

  // 経路を確定領域として保存
  definedAreas.set(areaName, path);

  // 経路記録をクリアし、新しい記録に備える
  playerPaths.delete(playerId);

  player.sendMessage(`§e領域「${areaName}」を${path.length}点で確定しました！`);
}

function isPointInPolygon(x, z, polygon) {
  let inside = false;
  const n = polygon.length;

  // レイキャスティングアルゴリズム (Ray Casting Algorithm)
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x;
    const zi = polygon[i].z;
    const xj = polygon[j].x;
    const zj = polygon[j].z;

    // X軸との交差をチェック
    const intersect =
      zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}
function checkPlayerInArea(player, areaName) {
  const polygon = definedAreas.get(areaName);

  if (!polygon) {
    // player.sendMessage(`§c領域「${areaName}」は定義されていません。`); // 頻繁な表示を避けるためコメントアウト
    return;
  }

  const playerX = player.location.x;
  const playerZ = player.location.z;

  if (isPointInPolygon(playerX, playerZ, polygon) && areaName == 'ocean') {
    if (player.hasTag('クリストファー・コロンブス')) {
      player.runCommandAsync(`effect @s speed 3 2`);
      player.runCommandAsync(`effect @s resistance 3 1`);
    } else {
      player.runCommandAsync(`effect @s wither 3 0`);
      player.runCommandAsync(`effect @s slowness 3 1`);
      player.runCommandAsync(
        `give @a[tag=クリストファー・コロンブス] gold_nugget 1 5`
      );
    }
  }
}

server.system.runInterval(() => {
  for (const apple of server.world.getAllPlayers()) {
    if (apple.hasTag('apple')) {
      if (get_score('cooltime_2', apple) <= 50) {
        finalizeArea(apple, 'ocean');
        cooltime(2, apple, 50);
        apple.runCommandAsync('tag @s remove apple');
      }
      recordPlayerLocation(apple);
      apple.sendMessage(`領海確定まで${get_score('cooltime_2', apple) - 50}秒`);
    }
    if (
      apple.hasTag('クリストファー・コロンブス') &&
      get_score('cooltime_2', apple) <= 25
    ) {
      deleteArea(apple, 'ocean');
    }
    checkPlayerInArea(apple, 'ocean');
    drawAreaBoundary(apple, 'ocean', -58);
  }
}, 20);

server.world.afterEvents.itemUse.subscribe((ev) => {
  if (
    ev.itemStack.typeId == 'minecraft:compass' &&
    ev.source.hasTag('クリストファー・コロンブス') &&
    ev.source.hasTag('apple')
  ) {
    finalizeArea(ev.source, 'ocean');
    cooltime(2, ev.source, 50);
    ev.source.runCommandAsync('tag @s remove apple');
  }
  if (
    ev.itemStack.typeId == 'minecraft:compass' &&
    ev.source.hasTag('クリストファー・コロンブス') &&
    !ev.source.hasTag('apple') &&
    get_score('cooltime_2', ev.source) == 0
  ) {
    deleteArea(ev.source, 'ocean');
    ev.source.addTag('apple');
    cooltime(2, ev.source, 60);
  }
});
//奴隷支配,相手の因果を奪う？
//アンカー,ひっぱれ！！！
server.world.afterEvents.itemUse.subscribe((ev) => {
  if (
    ev.itemStack.typeId == 'minecraft:arrow' &&
    get_score('cooltime_1', ev.source) == 0
  ) {
    ev.source.runCommandAsync('summon armor_stand anchor ^^1^1');
    ev.source.runCommandAsync(
      'execute as @e[type=armor_stand,name=anchor] at @s rotated as @a[tag=クリストファー・コロンブス] run tp @s ~~~ ~~'
    );
    ev.source.runCommandAsync('inputpermission set @s movement disabled');
    cooltime(1, ev.source, 20);
    let anchortime = 0;
    const anchors = server.system.runInterval(() => {
      anchortime++;
      ev.source.runCommandAsync(
        'execute as @e[type=armor_stand,name=anchor] at @s run tp @s ^^^1'
      );
      ev.source.runCommandAsync(
        'execute as @e[type=armor_stand,name=anchor] at @s run particle minecraft:small_soul_fire_flame ~~1~'
      );
      const anchorman = server.world
        .getDimension('overworld')
        .getEntities({ type: 'minecraft:armor_stand', name: 'anchor' });
      if (
        anchortime >= 50 ||
        (near_man(anchorman[0], 2).length > 0 && anchortime > 3)
      ) {
        const anchors2 = server.system.runInterval(() => {
          ev.source.runCommandAsync(
            'execute as @e[type=armor_stand,name=anchor] at @s run particle minecraft:small_soul_fire_flame ~~1~'
          );
          ev.source.runCommandAsync(
            'execute as @e[type=armor_stand,name=anchor] at @s run tp @s ^^^1 facing @a[tag=クリストファー・コロンブス]'
          );
          ev.source.runCommandAsync(
            'execute as @e[type=armor_stand,name=anchor] at @s run tp @a[tag=!クリストファー・コロンブス,r=2] ~~~ facing @a[tag=クリストファー・コロンブス]'
          );
          ev.source.runCommandAsync(
            'execute as @e[type=armor_stand,name=anchor] at @s run effect @a[tag=!クリストファー・コロンブス,r=2] wither 2 0 true'
          );
          ev.source.runCommandAsync('kill @e[r=2,name=anchor]');
          const anchorman2 = server.world
            .getDimension('overworld')
            .getEntities({ type: 'minecraft:armor_stand', name: 'anchor' });
          if (anchorman2.length == 0) {
            ev.source.runCommandAsync(
              'inputpermission set @s movement enabled'
            );
            server.system.clearRun(anchors2);
          }
        });
        server.system.clearRun(anchors);
      }
    });
  }
});
