import demanaLogo from './svg/demana-logo.svg'

import catalanFlag from './svg/flags/catalan-flag.svg'
import spanishFlag from './svg/flags/spanish-flag.svg'
import ukFlag from './svg/flags/uk-flag.svg'
import chineseFlag from './svg/flags/chinese-flag.svg'
import germanFlag from './svg/flags/german-flag.svg'
import frenchFlag from './svg/flags/french-flag.svg'
import dutchFlag from './svg/flags/dutch-flag.svg'
import italianFlag from './svg/flags/italian-flag.svg'
import russianFlag from './svg/flags/russian-flag.svg'
import japaneseFlag from './svg/flags/japanese-flag.svg'

import catalanFlagRounded from './svg/flags/catalan-flag-rounded.svg'
import spanishFlagRounded from './svg/flags/spanish-flag-rounded.svg'
import ukFlagRounded from './svg/flags/uk-flag-rounded.svg'
import chineseFlagRounded from './svg/flags/chinese-flag-rounded.svg'
import germanFlagRounded from './svg/flags/german-flag-rounded.svg'
import frenchFlagRounded from './svg/flags/french-flag-rounded.svg'
import dutchFlagRounded from './svg/flags/dutch-flag-rounded.svg'
import italianFlagRounded from './svg/flags/italian-flag-rounded.svg'
import russianFlagRounded from './svg/flags/russian-flag-rounded.svg'
import japaneseFlagRounded from './svg/flags/japanese-flag-rounded.svg'

type DemanaIcon = {
  icon: string;
  name: string;
};

type DemanaLocaleIcon = {
  regular: DemanaIcon;
  rounded: DemanaIcon;
};

export const icons: Record<string, DemanaIcon> = {
    demanaLogo: {
        icon: demanaLogo,
        name: 'demanaLogo'
    },
    catalanFlag: {
        icon: catalanFlag,
        name: 'catalanFlag'
    },
    spanishFlag: {
        icon: spanishFlag,
        name: 'spanishFlag'
    },
    ukFlag: {
        icon: ukFlag,
        name: 'ukFlag'
    },
    chineseFlag: {
        icon: chineseFlag,
        name: 'chineseFlag'
    },
    germanFlag: {
        icon: germanFlag,
        name: 'germanFlag'
    },
    frenchFlag: {
        icon: frenchFlag,
        name: 'frenchFlag'
    },
    dutchFlag: {
        icon: dutchFlag,
        name: 'dutchFlag'
    },
    italianFlag: {
        icon: italianFlag,
        name: 'italianFlag'
    },
    russianFlag: {
        icon: russianFlag,
        name: 'russianFlag'
    },
    japaneseFlag: {
        icon: japaneseFlag,
        name: 'japaneseFlag'
    },
    catalanFlagRounded: {
        icon: catalanFlagRounded,
        name: 'catalanFlagRounded'
    },
    spanishFlagRounded: {
        icon: spanishFlagRounded,
        name: 'spanishFlagRounded'
    },
    ukFlagRounded: {
        icon: ukFlagRounded,
        name: 'ukFlagRounded'
    },
    chineseFlagRounded: {
        icon: chineseFlagRounded,
        name: 'chineseFlagRounded'
    },
    germanFlagRounded: {
        icon: germanFlagRounded,
        name: 'germanFlagRounded'
    },
    frenchFlagRounded: {
        icon: frenchFlagRounded,
        name: 'frenchFlagRounded'
    },
    dutchFlagRounded: {
        icon: dutchFlagRounded,
        name: 'dutchFlagRounded'
    },
    italianFlagRounded: {
        icon: italianFlagRounded,
        name: 'italianFlagRounded'
    },
    russianFlagRounded: {
        icon: russianFlagRounded,
        name: 'russianFlagRounded'
    },
    japaneseFlagRounded: {
        icon: japaneseFlagRounded,
        name: 'japaneseFlagRounded'
    }
}

export const localeFlags: Record<string, DemanaLocaleIcon> = {
    en: {
        regular: icons.ukFlag,
        rounded: icons.ukFlagRounded
    },
    es: {
        regular: icons.spanishFlag,
        rounded: icons.spanishFlagRounded
    },
    ca: {
        regular: icons.catalanFlag,
        rounded: icons.catalanFlagRounded
    },
    cn: {
        regular: icons.chineseFlag,
        rounded: icons.chineseFlagRounded
    },
    ru: {
        regular: icons.russianFlag,
        rounded: icons.russianFlagRounded
    },
    nl: {
        regular: icons.dutchFlag,
        rounded: icons.dutchFlagRounded
    },
    de: {
        regular: icons.germanFlag,
        rounded: icons.germanFlagRounded
    },
    fr: {
        regular: icons.frenchFlag,
        rounded: icons.frenchFlagRounded
    },
    it: {
        regular: icons.italianFlag,
        rounded: icons.italianFlagRounded
    },
    ja: {
        regular: icons.japaneseFlag,
        rounded: icons.japaneseFlagRounded
    }
}

export function getFlagIconForLocaleTag(localeTag: string, rounded = false): DemanaIcon | null {
    const selectedLocaleFlag = localeFlags[localeTag]

    if (!selectedLocaleFlag) {
        return null
    }

    return selectedLocaleFlag[rounded ? 'rounded' : 'regular']
}
