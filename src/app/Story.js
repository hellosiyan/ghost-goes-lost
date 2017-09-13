import game from './Game'

export default function story(level) {
    let pick = options => game.prngs.story.pick(options);

    let weekDays = ['', '', 'Monday', 'Tuesday', 'Wednesday', '', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    let dayType = ['', 'One summer', 'One fall', '', 'One spring', '', '', 'A rainy', 'A stormy', '', 'That boring', '', 'An average']
    let dayTime = ['afternoon', 'night', 'morning']
    let startYear = 1985
    let yearIntervals = [1,2,3]
    let attr = ['One', '', 'That', '']

    let items = [
        'fresh dust around the aisle',
        'premium ghost sheets',
        'a fancy hat',
        'frozen ghost meal',
        'her husband Gary at the Spirits section',
    ]

    let structure = '%day%, %year%';

    let day = (pick(dayType) + ' ' + pick(weekDays) + ' ' + pick(dayTime)).trim()
    let year = startYear + 3*level + pick(yearIntervals)

    let text = 'Charlie\'s mom went looking for<br>' + items[level-1] + '.';
    if ( level > items.length  ) {
        text = '';
    }

    return {
        title: structure.replace('%day%', day).replace('%year%', year),
        text: text
    }
}
